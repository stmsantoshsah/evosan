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

    start_date = dates[0]

    # OPTIMIZATION: Use MongoDB Aggregation for faster grouped results

    # A. Fetch Journals (Avg mood per day)
    journal_cursor = db.client["evosan_db"]["journal_entries"].aggregate([
        {"$match": {"created_at": {"$gte": start_date}}},
        {"$project": {
            "date": {"$substr": ["$created_at", 0, 10]},
            "mood": 1
        }},
        {"$group": {
            "_id": "$date",
            "mood": {"$avg": "$mood"}
        }}
    ])
    journal_agg = await journal_cursor.to_list(None)
    mood_map = {item["_id"]: item["mood"] for item in journal_agg}

    # B. Fetch Habit Logs (Count completed habits per day)
    habit_cursor = db.client["evosan_db"]["habit_logs"].aggregate([
        {"$match": {"completed": True, "date": {"$gte": start_date}}},
        {"$group": {
            "_id": "$date",
            "count": {"$sum": 1}
        }}
    ])
    habit_agg = await habit_cursor.to_list(None)
    habit_counts = {item["_id"]: item["count"] for item in habit_agg}

    results = []
    for date_str in dates:
        day_name = datetime.strptime(date_str, "%Y-%m-%d").strftime("%a")
        results.append({
            "date": day_name,
            "fullDate": date_str,
            "mood": mood_map.get(date_str, 0),
            "habits": habit_counts.get(date_str, 0)
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
    
    # 4. Streak (Optimization: Fetch bulk history)
    streak = 0
    curr_date = datetime.now()
    
    # Fetch all dates with ANY completed habit in last 365 days
    one_year_ago = (curr_date - timedelta(days=365)).strftime("%Y-%m-%d")
    
    # Using MongoDB Aggregation to get distinct dates with at least one completed habit
    pipeline = [
        {"$match": {"completed": True, "date": {"$gte": one_year_ago}}},
        {"$group": {"_id": "$date"}},
        {"$sort": {"_id": -1}}
    ]
    cursor = db.client["evosan_db"]["habit_logs"].aggregate(pipeline)
    dates_list = await cursor.to_list(400) # Max 365 days in a year
    active_dates = {doc["_id"] for doc in dates_list}
    
    check_date = curr_date
    while True:
        d_str = check_date.strftime("%Y-%m-%d")
        if d_str in active_dates:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
            
    return {
        "habits_done": completed_habits,
        "total_habits": total_habits,
        "mood": mood,
        "water": water,
        "streak": streak
    }
