# backend/app/services/ai.py
import os
from groq import Groq
from datetime import datetime, timedelta
from app.db.database import db
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

async def generate_weekly_insight():
    # 1. Calculate Date Range (Last 7 Days)
    today = datetime.now()
    seven_days_ago = today - timedelta(days=7)
    
    # 2. Fetch Data
    # Fetch Journals
    cursor = db.client["evosan_db"]["journal_entries"].find({
        "created_at": {"$gte": seven_days_ago.isoformat()}
    })
    journals = await cursor.to_list(length=20)
    
    # Fetch Habits (We scan raw logs for simplicity)
    h_cursor = db.client["evosan_db"]["habit_logs"].find({
        "date": {"$gte": seven_days_ago.strftime("%Y-%m-%d")}
    })
    habit_logs = await h_cursor.to_list(length=100)
    
    # 3. Format Data for AI
    journal_text = "\n".join([f"- {j['created_at'][:10]} (Mood {j['mood']}/10): {j['content']}" for j in journals])
    
    total_habits_done = sum(1 for h in habit_logs if h['completed'])
    
    prompt = f"""
    You are an objective system analyst for a human's life. 
    Analyze the following data from the last 7 days.
    
    DATA:
    Habits Completed: {total_habits_done}
    
    JOURNAL ENTRIES:
    {journal_text}
    
    TASK:
    Provide a "Weekly Briefing" with exactly 3 sections:
    1. 🧠 Pattern Recognition: Connect mood to habits or events.
    2. 📉 Friction Points: What specifically caused stress or missed habits?
    3. 🚀 Directive: One single, high-impact action for next week.
    
    TONE:
    Stoic, analytical, concise. No fluff. No "Good job!". Max 150 words.
    """
    
    # 4. Call Groq (Llama3-8b is fast and smart)
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a stoic data analyst."},
            {"role": "user", "content": prompt},
        ],
        model="llama-3.3-70b-versatile",
    )
    
    return chat_completion.choices[0].message.content