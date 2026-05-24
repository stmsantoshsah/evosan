# backend/app/services/vector_db.py
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

# Ensure the DB directory exists in the backend workspace
DB_DIR = Path(__file__).resolve().parents[2] / "db"
CHROMA_PATH = DB_DIR / "chroma_data"
DB_DIR.mkdir(exist_ok=True)

print(f"Initializing ChromaDB vector store at: {CHROMA_PATH}")

try:
    # 1. Initialize local SentenceTransformers embedding function (all-MiniLM-L6-v2)
    # This generates 384-dimensional dense vectors offline for 100% free
    local_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )

    # 2. Connect to Chroma DB client
    chroma_client = chromadb.PersistentClient(path=str(CHROMA_PATH))

    # 3. Create or fetch our journals vector collection
    collection = chroma_client.get_or_create_collection(
        name="journal_embeddings",
        embedding_function=local_ef,
        metadata={"hnsw:space": "cosine"} # Use cosine similarity for distance calculations
    )
    print("ChromaDB Vector Collection 'journal_embeddings' active")
except Exception as e:
    print(f"FAILED TO INITIALIZE CHROMADB: {e}")
    # Fallback to in-memory fallback client if file-system is locked
    chroma_client = chromadb.EphemeralClient()
    collection = chroma_client.get_or_create_collection(name="journal_embeddings")
    print("Initialized Ephemeral (in-memory) fallback ChromaDB collection")


async def upsert_journal_vector(journal_id: str, content: str, mood: int, timestamp: str):
    """
    Saves or updates a journal entry and its cognitive state metadata in the Vector Database.
    """
    try:
        # Strip ID and cast everything safely
        collection.upsert(
            documents=[content],
            metadatas=[{
                "mood": int(mood),
                "timestamp": str(timestamp)
            }],
            ids=[str(journal_id)]
        )
        print(f"Indexed journal entry {journal_id} in ChromaDB")
    except Exception as e:
        print(f"Error indexing journal entry {journal_id} in ChromaDB: {e}")


async def query_journal_memory(query_text: str, n_results: int = 3):
    """
    Performs a semantic cosine-similarity search across historical journal memory entries.
    """
    try:
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results
    except Exception as e:
        print(f"Error querying ChromaDB vector search: {e}")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}
