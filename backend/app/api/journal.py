# backend/app/api/journal.py

from datetime import datetime

from fastapi import APIRouter, status

from app.db.database import db
from app.models.journal import JournalEntry
from app.services.vector_db import upsert_journal_vector

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_journal_entry(entry: JournalEntry):
    # Convert Pydantic model to dict
    entry_dict = entry.dict()

    # Insert into MongoDB collection named "journal_entries"
    new_entry = await db.client["evosan_db"]["journal_entries"].insert_one(entry_dict)

    # Sync with ChromaDB Vector Store
    inserted_id = str(new_entry.inserted_id)
    timestamp_str = entry.created_at.isoformat() if isinstance(entry.created_at, datetime) else str(entry.created_at)
    await upsert_journal_vector(
        journal_id=inserted_id,
        content=entry.content,
        mood=entry.mood,
        timestamp=timestamp_str
    )

    return {"id": inserted_id, "message": "Journal entry created and synchronized"}


@router.get("/", response_model=list[JournalEntry])
async def get_journal_entries():
    # Fetch all entries, sort by date (newest first), limit to 20
    entries = (
        await db.client["evosan_db"]["journal_entries"]
        .find()
        .sort("created_at", -1)
        .to_list(20)
    )
    return entries


@router.get("/search")
async def search_journal_memory(query: str):
    """
    RAG Search Endpoint:
    1. Semantic search on ChromaDB.
    2. Synthesize results using Groq LLM.
    3. Return matches and synthesis summary.
    """
    from groq import AsyncGroq

    from app.core.config import settings
    from app.services.vector_db import query_journal_memory

    if not query.strip():
        return {"matches": [], "synthesis": "Please enter a valid search query."}

    try:
        # 1. Fetch matching vector records from ChromaDB
        search_results = await query_journal_memory(query, n_results=5)

        documents = search_results.get("documents", [[]])[0]
        metadatas = search_results.get("metadatas", [[]])[0]
        ids = search_results.get("ids", [[]])[0]
        distances = search_results.get("distances", [[]])[0]

        if not documents:
            return {
                "matches": [],
                "synthesis": "No historical memory paths detected yet. Begin committing daily logs to populate your neural database."
            }

        # 2. Build matches list and context string
        matches = []
        context_str = ""
        for i in range(len(documents)):
            match_item = {
                "id": ids[i],
                "content": documents[i],
                "mood": metadatas[i].get("mood") if metadatas[i] else 5,
                "timestamp": metadatas[i].get("timestamp") if metadatas[i] else "",
                "distance": float(distances[i]) if distances else 0.0
            }
            matches.append(match_item)
            context_str += f"- Log entry from {match_item['timestamp']} (Cognitive Mood State: {match_item['mood']}/10): {match_item['content']}\n"

        # 3. Request LLM pattern synthesis
        prompt = f"""
        You are the Evosan Neural Stream Core, an advanced personal cognitive assistant.
        The user is querying their long-term semantic memory stream with: "{query}"

        Here are the most semantically relevant historical journal entries retrieved from the database:
        {context_str}

        === MISSION ===
        Synthesize these memories to answer the user's query:
        - Provide deep behavioral pattern analysis.
        - Highlight if this represents a recurring emotional/productivity cycle, health correlation, or protocol drift.
        - Frame suggestions with a decisive, strategic, yet encouraging Senior Engineer executive tone.
        - Keep the synthesis to 2-3 highly insightful paragraphs, using bullet points for key takeaways if needed.
        """

        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a Senior Executive Coach and Cognitive Systems Analyst."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            max_tokens=800,
        )
        synthesis = completion.choices[0].message.content

        return {
            "matches": matches,
            "synthesis": synthesis
        }

    except Exception as e:
        print(f"RAG Semantic Search Error: {e}")
        return {"matches": [], "synthesis": f"Error performing semantic query synthesis: {str(e)}"}
