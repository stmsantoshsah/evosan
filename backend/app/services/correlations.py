import os
import json
import logging
from datetime import datetime, timedelta
from app.db.database import db
import groq
from groq import AsyncGroq

class CorrelationService:
    def __init__(self):
        self.client = None

    def _get_client(self):
        if not self.client:
            from dotenv import load_dotenv
            load_dotenv()
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                logging.error("GROQ_API_KEY not found in environment")
            # USE ASYNC CLIENT
            self.client = AsyncGroq(api_key=api_key)
        return self.client

    async def get_correlation_data(self, days: int = 7):
        # 1. Fetch Last 7 Days Data
        # Ensure client is ready
        try:
            client = self._get_client()
        except Exception as e:
            logging.error(f"Failed to initialize Groq client: {e}")
            return {"neural_analysis": {"friction": "Config Error", "flow": "Check Logs", "directive": "Fix API Key"}, "insights": ["System Config Error"]}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days-1)
        date_list = [(start_date + timedelta(days=x)).strftime("%Y-%m-%d") for x in range(days)]

        logs_summary = []

        for date_str in date_list:
            # Fetch daily metrics
            mood_entry = await db.client["evosan_db"]["journal_entries"].find_one({
                "created_at": {"$regex": f"^{date_str}"}
            })
            
            habit_logs = await db.client["evosan_db"]["habit_logs"].find({
                "date": date_str,
                "completed": True
            }).to_list(length=100)
            
            workout = await db.client["evosan_db"]["workouts"].find_one({"date": date_str})

            if mood_entry or habit_logs or workout:
                entry = f"Date: {date_str}\n"
                if mood_entry:
                    entry += f"Mood: {mood_entry.get('mood')}/10. Journal: {mood_entry.get('content', 'No content')}\n"
                if workout:
                    entry += f"Workout: {workout.get('routine_name')} ({workout.get('duration_mins')} min)\n"
                if habit_logs:
                    habits = [h['habit_id'] for h in habit_logs] # Just IDs or we'd need names. 
                    # For efficiency, just putting count. The AI can infer from Journal mostly.
                    entry += f"Habits Completed: {len(habit_logs)}\n"
                logs_summary.append(entry)

        if not logs_summary:
            return {
                "neural_analysis": {
                    "friction": "No data logs found.",
                    "flow": "No data logs found.",
                    "directive": "Initialize protocol: Log your first day."
                },
                 "insights": ["Log data to activate Neural Analysis."]
            }

        context_text = "\n".join(logs_summary)

        # 2. Strategic Analysis via Groq
        system_prompt = """
        Analyze these 7 days of logs.
        Identify the primary 'Friction Point' (what caused missed habits? or low mood?).
        Identify the 'Flow State' trigger (what caused high mood? or consistency?).
        Give me one specific 'Directive' for tomorrow.
        Output JSON ONLY: { "friction": string, "flow": string, "directive": string }
        Keep text concise, military/cyberpunk style.
        """

        try:
            client = self._get_client()
            # AWAIT THE ASYNC CALL
            completion = await client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": context_text}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
            )
            
            content = completion.choices[0].message.content
            analysis = json.loads(content)
            
            # Map to expected structure
            return {
                "neural_analysis": {
                    "friction": analysis.get("friction", "Unknown"),
                    "flow": analysis.get("flow", "Unknown"),
                    "directive": analysis.get("directive", "Maintain course.")
                },
                # Keep old format for compatibility if needed, but UI will check neural_analysis
                "insights": [
                    f"Friction: {analysis.get('friction')}",
                    f"Flow: {analysis.get('flow')}",
                    f"Directive: {analysis.get('directive')}"
                ]
            }

        except Exception as e:
            logging.error(f"Groq Analysis Failed: {e}")
            return {
                 "neural_analysis": {
                    "friction": "System Offline",
                    "flow": "System Offline",
                    "directive": "Manual Override Required"
                },
                "insights": ["Neural Link Failed."]
            }

correlation_service = CorrelationService()
