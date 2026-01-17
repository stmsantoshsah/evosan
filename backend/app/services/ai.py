import os
from groq import AsyncGroq
from datetime import datetime, timedelta
from app.db.database import db
from app.core.config import settings

# Initialize Groq Client
client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def generate_weekly_insight():
    # 1. Calculate Date Range (Last 7 Days)
    today = datetime.now()
    seven_days_ago = today - timedelta(days=7)
    date_query = {"$gte": seven_days_ago.isoformat()} # For ISO dates
    str_date_query = {"$gte": seven_days_ago.strftime("%Y-%m-%d")} # For String dates (YYYY-MM-DD)
    
    # 2. FETCH ALL DATA STREAMS
    
    # A. Journals (Mental State)
    j_cursor = db.client["evosan_db"]["journal_entries"].find({"created_at": date_query})
    journals = await j_cursor.to_list(length=20)
    
    # B. Habits (Discipline)
    h_cursor = db.client["evosan_db"]["habit_logs"].find({"date": str_date_query})
    habit_logs = await h_cursor.to_list(length=100)
    
    # C. Health: Workouts (Physical Output)
    w_cursor = db.client["evosan_db"]["workouts"].find({"date": str_date_query})
    workouts = await w_cursor.to_list(length=7)
    
    # D. Health: Nutrition (Biological Input)
    n_cursor = db.client["evosan_db"]["nutrition"].find({"date": str_date_query})
    nutrition = await n_cursor.to_list(length=7)
    
    # 3. CONSTRUCT THE CONTEXT STRING (The "Prompt Engineering" Part)
    
    # Format Journals
    journal_text = "\n".join([f"- {j['created_at'][:10]} (Mood {j['mood']}/10): {j['content']}" for j in journals])
    
    # Format Habits
    total_habits_done = sum(1 for h in habit_logs if h['completed'])
    
    # Format Health
    workout_text = "\n".join([f"- {w['date']}: {w.get('routine_name', 'Workout')} (Intensity {w.get('intensity', 0)}/10)" for w in workouts])
    nutrition_text = "\n".join([f"- {n['date']}: {n.get('calories', 0)}kcal, {n.get('protein_grams', 0)}g protein" for n in nutrition])

    # 4. THE PROMPT
    # 4. THE PROMPT
    prompt = f"""
    You are 'Evosan', a tactical analysis AI. Analyze the user's data from the last 7 days.
    
    === DATA LOGS ===
    
    [MENTAL STATE (JOURNAL)]
    {journal_text if journals else "No journals logged."}
    
    [DISCIPLINE (HABITS)]
    Total Habits Completed: {total_habits_done}
    
    [PHYSICAL OUTPUT (WORKOUTS)]
    {workout_text if workouts else "No workouts logged."}
    
    [BIOLOGICAL INPUT (NUTRITION)]
    {nutrition_text if nutrition else "No nutrition logged."}
    
    === MISSION ===
    Identify hidden correlations between Inputs (Nutrition, Habits) and Outputs (Mood, Workout Intensity).
    
    === RULES ===
    1. Never use YYYY-MM-DD dates. Use 'Monday', 'Yesterday', or 'Last Week'.
    2. Be concise and direct. Use military/system terminology (e.g., 'Protocol Failure', 'Optimized').
    3. Output strictly valid JSON.
    
    === OUTPUT FORMAT (JSON ONLY) ===
    {{
        "score": number, // 0-100 (Weekly Optimization Score based on consistency and mood)
        "pattern": "string", // Direct correlation detected
        "friction": "string", // Critical Protocol Failure or specific issue
        "directive": "string" // Protocol Update / Tactical Directive for tomorrow
    }}
    """
    
    # 5. CALL GROQ (Using the new Llama 3.3 model)
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a tactical analysis AI. Return JSON only."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
            response_format={"type": "json_object"},
        )
        content = chat_completion.choices[0].message.content
        import json
        return json.loads(content)
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Return fallback JSON
        return {
            "score": 0,
            "pattern": "Neural link unstable.",
            "friction": "System offline.",
            "directive": "Retry manual connection."
        }
