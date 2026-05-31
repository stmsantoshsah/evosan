# backend/app/services/ai/transcription.py
from pathlib import Path

from fastapi import HTTPException

from app.services.ai.client import groq_client


async def transcribe_audio_file(file_path: Path, filename: str) -> str:
    """
    Transcribes a given local audio file to text using Groq's high-speed Whisper model.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Audio file at path {file_path} does not exist.")

    try:
        with file_path.open("rb") as audio_file:
            transcription = await groq_client.audio.transcriptions.create(
                file=(filename, audio_file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
            )
        return transcription.text
    except Exception as e:
        print(f"Error during Groq Whisper audio transcription: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}") from e
