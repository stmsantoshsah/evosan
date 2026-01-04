# backend/app/models/health.py
from pydantic import BaseModel, Field
from typing import Optional

class WorkoutLog(BaseModel):
    date: str  # YYYY-MM-DD
    routine_name: str = Field(..., example="Push Day")
    duration_mins: int = Field(..., example=60)
    exercises: str = Field(..., example="Bench Press: 3x10, Incline: 3x12")
    intensity: int = Field(..., ge=1, le=10) # 1-10 scale

class NutritionLog(BaseModel):
    date: str # YYYY-MM-DD
    calories: int
    protein_grams: int
    water_liters: float
    notes: Optional[str] = "Chicken & Rice"