# backend/app/api/stats.py
from fastapi import APIRouter
from app.db.database import db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/weekly")
async def get_weekly_stats():
    # 1. Generate dates for the last 7 days
    today = datetime.now()
    dates = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        dates.append(d.strftime("%Y-%m-%d")) # ["2023-10-20", "2023-10-21"...]

    results = []

    for date_str in dates:
        # A. Fetch Mood (Journal)
        # We assume one entry per day for simplicity, or take the average if multiple
        # Note: In MongoDB we stored created_at as ISO string, so we regex match the date part
        journal = await db.client["evosan_db"]["journal_entries"].find_one({
            "created_at": {"$regex": f"^{date_str}"} 
        })
        
        mood = journal["mood"] if journal else 0

        # B. Count Habits
        habit_count = await db.client["evosan_db"]["habit_logs"].count_documents({
            "date": date_str,
            "completed": True
        })

        # C. Format day name (Mon, Tue) for the chart
        day_name = datetime.strptime(date_str, "%Y-%m-%d").strftime("%a")

        results.append({
            "date": day_name,     # "Mon"
            "fullDate": date_str, # "2023-10-20"
            "mood": mood,         # 8
            "habits": habit_count # 5
        })

    return results

@router.get("/summary")
async def get_daily_summary(date_str: str = None):
    if not date_str:
        date_str = datetime.now().strftime("%Y-%m-%d")
        
    # 1. Habits
    total_habits = await db.client["evosan_db"]["habits"].count_documents({})
    completed_habits = await db.client["evosan_db"]["habit_logs"].count_documents({
        "date": date_str,
        "completed": True
    })
    
    # 2. Mood
    journal = await db.client["evosan_db"]["journal_entries"].find_one({
        "created_at": {"$regex": f"^{date_str}"}
    })
    mood = journal["mood"] if journal else 0
    
    # 3. Water
    nutrition = await db.client["evosan_db"]["nutrition"].find_one({"date": date_str})
    water = nutrition["water_liters"] if nutrition else 0.0
    
    # 4. Streak (Simplified calculation)
    streak = 0
    curr_date = datetime.now()
    while True:
        d_str = curr_date.strftime("%Y-%m-%d")
        log = await db.client["evosan_db"]["habit_logs"].find_one({
            "date": d_str,
            "completed": True
        })
        if log:
            streak += 1
            curr_date -= timedelta(days=1)
        else:
            break
            
    return {
        "habits_done": completed_habits,
        "total_habits": total_habits,
        "mood": mood,
        "water": water,
        "streak": streak
    }
