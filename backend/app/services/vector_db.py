# backend/app/services/vector_db.py
import uuid
from datetime import datetime

from chromadb.utils import embedding_functions

from app.db.database import db
from app.db.supabase_db import supabase_db

print("Initializing local SentenceTransformers embedding function...")
try:
    # Initialize local SentenceTransformers embedding function (all-MiniLM-L6-v2)
    # This generates 384-dimensional dense vectors offline for 100% free
    local_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    print("SentenceTransformers active")
except Exception as e:
    print(f"FAILED TO INITIALIZE SENTENCETRANSFORMERS: {e}")
    local_ef = None


def mongo_id_to_uuid(mongo_id: str) -> str:
    """
    Deterministically converts a 24-character MongoDB ObjectId hex string
    to a valid 32-character UUID string by padding it.
    """
    padded_hex = mongo_id.ljust(32, '0')
    return str(uuid.UUID(hex=padded_hex))


def uuid_to_mongo_id(uuid_str: str) -> str:
    """
    Deterministically converts a UUID string back to the original 24-character
    MongoDB ObjectId hex string.
    """
    return uuid_str.replace("-", "")[:24]


async def upsert_journal_vector(journal_id: str, content: str, mood: int, timestamp: str):
    """
    Saves or updates a journal entry's vector embedding in Supabase pgvector database.
    """
    _ = timestamp
    if not supabase_db.client:
        print("WARNING: Supabase client is offline. Vector upsert skipped.")
        return

    if not local_ef:
        print("WARNING: SentenceTransformers is uninitialized. Vector upsert skipped.")
        return

    try:
        # 1. Generate the 384-dimensional vector embedding offline
        embedding = local_ef([content])[0]
        # Convert embedding to a list of floats (if it's a numpy array)
        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()
        else:
            embedding = [float(x) for x in embedding]

        # 2. Map MongoDB string ID to a deterministic UUID
        entry_uuid = mongo_id_to_uuid(journal_id)

        # 3. Upsert into Supabase journal_entries table
        await supabase_db.client.from_("journal_entries").upsert({
            "id": entry_uuid,
            "content": content,
            "mood": int(mood),
            "embedding": embedding
        }).execute()

        print(f"Indexed journal entry {journal_id} in Supabase pgvector")
    except Exception as e:
        print(f"Error indexing journal entry {journal_id} in Supabase: {e}")


async def query_journal_memory(query_text: str, n_results: int = 3):
    """
    Performs a semantic cosine-similarity search using Supabase pgvector.
    Then, enriches matching records with exact timestamps and metadata from MongoDB.
    """
    if not supabase_db.client:
        print("WARNING: Supabase client is offline. Vector query skipped.")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

    if not local_ef:
        print("WARNING: SentenceTransformers is uninitialized. Vector query skipped.")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

    try:
        # 1. Generate query embedding
        embedding = local_ef([query_text])[0]
        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()
        else:
            embedding = [float(x) for x in embedding]

        # 2. Call RPC match_journals function in Supabase
        res = await supabase_db.client.rpc("match_journals", {
            "query_embedding": embedding,
            "match_threshold": 0.0,
            "match_count": n_results
        }).execute()

        ids = []
        documents = []
        metadatas = []
        distances = []

        if res.data:
            for row in res.data:
                mongo_id = uuid_to_mongo_id(row["id"])
                ids.append(mongo_id)
                documents.append(row["content"])
                metadatas.append({
                    "mood": row["mood"],
                    "timestamp": ""  # Will be enriched below
                })
                # Similarity = 1 - Cosine Distance. So distance = 1 - similarity.
                distances.append(float(1.0 - row["similarity"]))

            # 3. Enrich with MongoDB exact metadata if MongoDB is connected
            if db.client and ids:
                from bson import ObjectId
                try:
                    mongo_ids = [ObjectId(id_str) for id_str in ids]
                    db_entries = await db.client["evosan_db"]["journal_entries"].find(
                        {"_id": {"$in": mongo_ids}}
                    ).to_list(length=len(ids))

                    entry_map = {str(e["_id"]): e for e in db_entries}

                    for i, id_str in enumerate(ids):
                        db_entry = entry_map.get(id_str)
                        if db_entry:
                            timestamp_val = db_entry.get("created_at")
                            if isinstance(timestamp_val, datetime):
                                timestamp_str = timestamp_val.isoformat()
                            else:
                                timestamp_str = str(timestamp_val or "")
                            metadatas[i]["timestamp"] = timestamp_str
                except Exception as mongo_err:
                    print(f"Error enriching metadata from MongoDB: {mongo_err}")

        return {
            "ids": [ids],
            "documents": [documents],
            "metadatas": [metadatas],
            "distances": [distances]
        }

    except Exception as e:
        print(f"Error querying Supabase vector search: {e}")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}
