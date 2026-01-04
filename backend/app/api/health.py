# backend/app/api/health.py
from fastapi import APIRouter
from app.db.database import db
from app.models.health import WorkoutLog, NutritionLog

router = APIRouter()

# --- WORKOUT ROUTES ---
@router.post("/workout")
async def log_workout(log: WorkoutLog):
    await db.client["evosan_db"]["workouts"].update_one(
        {"date": log.date},
        {"$set": log.dict()},
        upsert=True
    )
    return {"message": "Workout logged"}

# --- NUTRITION ROUTES ---
@router.post("/nutrition")
async def log_nutrition(log: NutritionLog):
    await db.client["evosan_db"]["nutrition"].update_one(
        {"date": log.date},
        {"$set": log.dict()},
        upsert=True
    )
    return {"message": "Nutrition logged"}

# --- GET DAILY STATS ---
@router.get("/{date}")
async def get_health_daily(date: str):
    workout = await db.client["evosan_db"]["workouts"].find_one({"date": date})
    nutrition = await db.client["evosan_db"]["nutrition"].find_one({"date": date})
    
    return {
        "workout": {k:v for k,v in workout.items() if k != '_id'} if workout else None,
        "nutrition": {k:v for k,v in nutrition.items() if k != '_id'} if nutrition else None
    }