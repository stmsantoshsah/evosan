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