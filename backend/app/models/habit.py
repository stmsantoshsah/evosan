# backend/app/models/habit.py

from pydantic import BaseModel, Field


# The Definition (e.g., "Gym")
class Habit(BaseModel):
    name: str
    category: str = Field(..., description="health, learning, productivity, etc.")


# The Log (e.g., "Gym done on 2023-10-27")
class HabitLog(BaseModel):
    habit_id: str
    date: str  # Format YYYY-MM-DD to avoid timezone headaches
    completed: bool
