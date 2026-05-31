import json
from datetime import datetime, timedelta

from app.db.database import db
from app.services.ai.client import groq_client


async def analyze_journal_entry(transcript: str) -> dict:
    """
    Analyzes a raw voice or text journal transcript for mood, communication confidence,
    grammar upgrades, and coaching notes.
    """
    analysis_prompt = f"""
    Analyze this voice journal transcript from a user who is working on their English and confidence.

    TRANSCRIPT: "{transcript}"

    === MISSION ===
    1. Evaluate the Mood (0-10).
    2. Give a 'Communication Confidence Score' (0-100).
    3. Identify 1-2 'Grammar/Fluency Upgrades' (Better ways to say what they said in a professional/senior context).
    4. Provide a 'Tactical Directive' for their communication tomorrow.

    === RULES ===
    - Be encouraging but direct (Senior Coach persona).
    - Output strictly valid JSON only. Do not wrap in markdown code blocks.

    === FORMAT ===
    {{
        "mood": number,
        "confidence_score": number,
        "improvements": ["upgrade 1", "upgrade 2"],
        "coaching_note": "string",
        "tactical_directive": "string"
    }}
    """

    try:
        analysis_completion = await groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a Senior Communication Coach and AI Analyst. Return JSON only.",
                },
                {"role": "user", "content": analysis_prompt},
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
        return json.loads(analysis_completion.choices[0].message.content)
    except Exception as e:
        print(f"Error in Groq coaching analysis completion: {e}")
        return {
            "mood": 5,
            "confidence_score": 50,
            "improvements": ["Maintain vocal pacing"],
            "coaching_note": "Analyzing system links down. Keep practice runs daily.",
            "tactical_directive": "Focus on slow vocal pacing and strong vocabulary."
        }


async def generate_weekly_insight() -> dict:
    """
    Analyzes user behavioral data across 7 days to isolate optimization correlations and directives.
    Retrieves data streams directly from MongoDB and evaluates correlations using Llama 3.3.
    """
    # 1. Calculate Date Range (Last 7 Days)
    today = datetime.now()
    seven_days_ago = today - timedelta(days=7)
    date_query = {"$gte": seven_days_ago.isoformat()}  # For ISO dates
    str_date_query = {
        "$gte": seven_days_ago.strftime("%Y-%m-%d")
    }  # For String dates (YYYY-MM-DD)

    # 2. FETCH ALL DATA STREAMS
    try:
        # A. Journals (Mental State)
        j_cursor = db.client["evosan_db"]["journal_entries"].find(
            {"created_at": date_query}
        )
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
    except Exception as e:
        print(f"Error fetching data streams for weekly insights: {e}")
        return {
            "score": 0,
            "pattern": "Database pipeline offline.",
            "friction": "System logs inaccessible.",
            "directive": "Restore data logs to resume telemetry."
        }

    # 3. CONSTRUCT THE CONTEXT STRING (The "Prompt Engineering" Part)
    journal_text = "\n".join(
        [
            f"- {j['created_at'][:10]} (Mood {j['mood']}/10): {j['content']}"
            for j in journals
        ]
    )
    total_habits_done = sum(1 for h in habit_logs if h["completed"])
    workout_text = "\n".join(
        [
            f"- {w['date']}: {w.get('routine_name', 'Workout')} (Intensity {w.get('intensity', 0)}/10)"
            for w in workouts
        ]
    )
    nutrition_text = "\n".join(
        [
            f"- {n['date']}: {n.get('calories', 0)}kcal, {n.get('protein_grams', 0)}g protein"
            for n in nutrition
        ]
    )

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
    3. Output strictly valid JSON only.

    === OUTPUT FORMAT (JSON ONLY) ===
    {{
        "score": number, // 0-100 (Weekly Optimization Score based on consistency and mood)
        "pattern": "string", // Direct correlation detected
        "friction": "string", // Critical Protocol Failure or specific issue
        "directive": "string" // Protocol Update / Tactical Directive for tomorrow
    }}
    """

    try:
        chat_completion = await groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a tactical analysis AI. Return JSON only.",
                },
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        print(f"Groq Weekly Insight API Error: {e}")
        return {
            "score": 0,
            "pattern": "Neural link unstable.",
            "friction": "System offline.",
            "directive": "Retry manual connection.",
        }
