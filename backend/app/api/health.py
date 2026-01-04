# backend/app/api/health.py
from fastapi import APIRouter
from app.db.database import db
from app.models.health import WorkoutLog, NutritionLog, WorkoutPlan

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

# 1. Save Plan (e.g., Set Monday = Chest)
@router.post("/plan")
async def save_workout_plan(plan: WorkoutPlan):
    await db.client["evosan_db"]["workout_plans"].update_one(
        {"day": plan.day}, # Agar Monday pehle se hai to update karo
        {"$set": plan.dict()},
        upsert=True # Agar nahi hai to naya banao
    )
    return {"message": f"Plan saved for {plan.day}"}

# 2. Get Plan for a specific day (e.g., Get Monday's plan)
@router.get("/plan/{day_name}")
async def get_workout_plan(day_name: str):
    plan = await db.client["evosan_db"]["workout_plans"].find_one({"day": day_name})
    if plan:
        return {k:v for k,v in plan.items() if k != '_id'}
    return None

# 3. Get All Plans (Settings page ke liye)
@router.get("/plans/all")
async def get_all_plans():
    cursor = db.client["evosan_db"]["workout_plans"].find()
    plans = await cursor.to_list(length=7)
    # Convert _id to string or remove it
    return [{k:v for k,v in p.items() if k != '_id'} for p in plans]