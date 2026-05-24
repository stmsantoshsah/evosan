# backend/app/models/journal.py
from datetime import datetime

from pydantic import BaseModel, Field


class JournalEntry(BaseModel):
    title: str | None = "Untitled"
    content: str
    mood: int = Field(..., ge=1, le=10, description="Mood from 1 to 10")
    tags: list[str] = []
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Morning Reflection",
                "content": "Felt good today. Focused on deep work.",
                "mood": 8,
                "tags": ["work", "morning"],
                "created_at": "2023-10-27T10:00:00",
            }
        }
