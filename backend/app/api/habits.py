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
    
    if not habits:
        return []

    habit_ids = [str(h["_id"]) for h in habits]

    # OPTIMIZATION: Fetch ALL logs for these habits in one query
    # We fetch logs for the last 365 days to calculate streaks efficiently in memory
    # limiting to 365 days prevents fetching ancient history, assuming streaks < 1 year
    one_year_ago = (today_dt - timedelta(days=365)).isoformat()
    
    all_logs_cursor = db.client["evosan_db"]["habit_logs"].find({
        "habit_id": {"$in": habit_ids},
        "completed": True,
        "date": {"$gte": one_year_ago}
    })
    
    all_logs = await all_logs_cursor.to_list(length=10000)
    
    # Group logs by habit_id -> set of dates
    logs_by_habit = {hid: set() for hid in habit_ids}
    for log in all_logs:
        logs_by_habit[log["habit_id"]].add(log["date"])

    results = []
    for h in habits:
        h_id = str(h["_id"])
        completed_dates = logs_by_habit.get(h_id, set())
        
        # Build History [Boolean]
        history = [d in completed_dates for d in last_7_days]
        
        # Calculate Streak (Backwards from today/yesterday)
        streak = 0
        check_date = today_dt
        
        # Logic: If today is done, streak starts today.
        # If today is NOT done, but yesterday WAS, streak is alive (starts yesterday).
        # If neither, streak is 0.
        
        current_date_str = check_date.isoformat()
        yesterday_str = (check_date - timedelta(days=1)).isoformat()
        
        if current_date_str in completed_dates:
            pass # Start checking from today
        elif yesterday_str in completed_dates:
             check_date -= timedelta(days=1) # Start checking from yesterday
        else:
             check_date = None # Streak broken/zero
             
        if check_date:
            while True:
                if check_date.isoformat() in completed_dates:
                    streak += 1
                    check_date -= timedelta(days=1)
                else:
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