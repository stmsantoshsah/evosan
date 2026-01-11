# backend/app/api/habits.py
from fastapi import APIRouter, HTTPException, status, Query
from app.db.database import db
from app.models.habit import Habit, HabitLog
from typing import List
from datetime import date
from bson import ObjectId

router = APIRouter()

# 1. Create a Habit
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_habit(habit: Habit):
    # 1. Check if habit with this name already exists
    existing = await db.client["evosan_db"]["habits"].find_one({"name": habit.name})
    
    if existing:
        # If it exists, don't create a new one. Just return the existing ID.
        return {"id": str(existing["_id"]), "message": "Habit already exists"}

    # 2. If not, create it
    habit_dict = habit.model_dump()
    new_habit = await db.client["evosan_db"]["habits"].insert_one(habit_dict)
    return {"id": str(new_habit.inserted_id), "message": "Habit created"}

# 2. Get Habits (with today's status)
@router.get("/")
async def get_habits(date_str: str = Query(default=None)):
    # If no date provided, use today
    target_date = date_str or date.today().isoformat()
    
    # Fetch all defined habits
    habits_cursor = db.client["evosan_db"]["habits"].find()
    habits = await habits_cursor.to_list(length=100)
    
    results = []
    for h in habits:
        h_id = str(h["_id"])
        
        # Check if there is a log for this habit on this date
        log = await db.client["evosan_db"]["habit_logs"].find_one({
            "habit_id": h_id,
            "date": target_date
        })
        
        results.append({
            "id": h_id,
            "name": h["name"],
            "category": h["category"],
            "completed": log["completed"] if log else False
        })
        
    return results

# 3. Toggle Habit (Check/Uncheck)
@router.post("/log")
async def log_habit(log: HabitLog):
    # Upsert: Update if exists, Insert if new
    await db.client["evosan_db"]["habit_logs"].update_one(
        {"habit_id": log.habit_id, "date": log.date},
        {"$set": {"completed": log.completed}},
        upsert=True
    )
    return {"message": "Habit updated"}