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
    # 1. Check if habit with this name already exists (case-insensitive)
    existing = await db.client["evosan_db"]["habits"].find_one({
        "name": {"$regex": f"^{habit.name}$", "$options": "i"}
    })
    
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
    today_dt = date.fromisoformat(target_date)
    
    # Generate last 7 days (including today)
    from datetime import timedelta
    last_7_days = [(today_dt - timedelta(days=i)).isoformat() for i in range(6, -1, -1)] # [Today-6, ... Today]

    # Fetch all defined habits
    habits_cursor = db.client["evosan_db"]["habits"].find()
    habits = await habits_cursor.to_list(length=100)
    
    results = []
    for h in habits:
        h_id = str(h["_id"])
        
        # Fetch logs for this habit for the last 7 days
        # We can optimize this with a single query, but loop is fine for <100 habits
        logs_cursor = db.client["evosan_db"]["habit_logs"].find({
            "habit_id": h_id,
            "date": {"$in": last_7_days},
            "completed": True
        })
        logs = await logs_cursor.to_list(length=7)
        completed_dates = {l["date"] for l in logs} # Set of YYYY-MM-DD
        
        # Build History [Boolean]
        history = [d in completed_dates for d in last_7_days]
        
        # Calculate Streak (Backwards from today/yesterday)
        streak = 0
        check_date = today_dt
        while True:
            d_s = check_date.isoformat()
            # Check if this date is completed
            # We need to query DB for streak if it goes beyond 7 days
            # For efficiency, let's just count consecutive days in DB for now
            # Or simplified: if today is done, streak includes today. 
            # If today not done, streak might still be valid if yesterday was done?
            # Standard logic: Streak is unbroken chain ending today or yesterday.
            
            # Use specific DB query for streak
            s_log = await db.client["evosan_db"]["habit_logs"].find_one({
                "habit_id": h_id, 
                "date": d_s, 
                "completed": True
            })
            if s_log:
                streak += 1
                check_date -= timedelta(days=1)
            else:
                 # If today is NOT done, but yesterday WAS, streak allows today to be skipped physically but logically user wants "current streak"
                 # Usually if today is missing, streak is pending.
                 if d_s == target_date: # If checking today and it's missing, try yesterday
                     check_date -= timedelta(days=1)
                     continue
                 break

        results.append({
            "id": h_id,
            "name": h["name"],
            "category": h["category"],
            "completed": target_date in completed_dates,
            "history": history,
            "streak": streak
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