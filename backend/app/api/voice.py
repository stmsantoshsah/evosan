import json
import shutil
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from groq import AsyncGroq

from app.core.config import settings
from app.db.database import db
from app.services.vector_db import upsert_journal_vector

router = APIRouter()
client = AsyncGroq(api_key=settings.GROQ_API_KEY)

TEMP_DIR = Path("temp_audio")
TEMP_DIR.mkdir(exist_ok=True)


@router.post("/journal")
async def process_voice_journal(file: UploadFile = File(...)):
    """
    Process a voice journal entry:
    1. Transcribe audio using Groq Whisper.
    2. Analyze transcript for mood, confidence, and English improvements.
    3. Save the entry to MongoDB.
    4. Sync with ChromaDB Vector Store.
    5. Return coaching feedback and transcript.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_path = TEMP_DIR / file.filename

    try:
        # 1. Save uploaded file temporarily
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Transcribe using Groq Whisper
        with file_path.open("rb") as audio_file:
            transcription = await client.audio.transcriptions.create(
                file=(file.filename, audio_file.read()),
                model="distil-whisper-large-v3-it",
                response_format="verbose_json",
            )

        transcript = transcription.text

        # 3. Analyze using Llama 3.3
        analysis_prompt = f"""
        Analyze this voice journal transcript from a user who is working on their English and confidence.

        TRANSCRIPT: "{transcript}"

        === MISSION ===
        1. Evaluate the Mood (0-10).
        2. Give a 'Communication Confidence Score' (0-100).
        3. Identify 1-2 'Grammar/Fluency Upgrades' (Better ways to say what they said in a professional/senior context).
        4. Provide a 'Tactical Directive' for their communication tomorrow.

        === RULES ===
        - Be encouraging but direct (Senior Coach persona).
        - Output strictly valid JSON.

        === FORMAT ===
        {{
            "mood": number,
            "confidence_score": number,
            "improvements": ["upgrade 1", "upgrade 2"],
            "coaching_note": "string",
            "tactical_directive": "string"
        }}
        """

        analysis_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a Senior Communication Coach and AI Analyst. Return JSON only.",
                },
                {"role": "user", "content": analysis_prompt},
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )

        analysis = json.loads(analysis_completion.choices[0].message.content)
        timestamp = datetime.now()

        # 4. Save to MongoDB collection "journal_entries"
        entry_dict = {
            "title": "Voice Codex Log",
            "content": transcript,
            "mood": int(analysis.get("mood", 5)),
            "tags": ["voice"],
            "created_at": timestamp
        }
        new_entry = await db.client["evosan_db"]["journal_entries"].insert_one(entry_dict)
        inserted_id = str(new_entry.inserted_id)

        # 5. Sync with ChromaDB Vector Store
        await upsert_journal_vector(
            journal_id=inserted_id,
            content=transcript,
            mood=int(analysis.get("mood", 5)),
            timestamp=timestamp.isoformat()
        )

        return {
            "transcript": transcript,
            "analysis": analysis,
            "timestamp": timestamp.isoformat(),
        }

    except Exception as e:
        print(f"Voice Processing Error: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e

    finally:
        # Clean up temp file
        if file_path.exists():
            file_path.unlink()
