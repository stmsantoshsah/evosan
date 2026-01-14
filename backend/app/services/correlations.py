# backend/app/services/correlations.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from app.db.database import db

class CorrelationService:
    async def get_correlation_data(self, days: int = 30):
        # 1. Generate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days-1)
        date_list = [(start_date + timedelta(days=x)).strftime("%Y-%m-%d") for x in range(days)]

        data = []

        for date_str in date_list:
            # Fetch daily metrics
            mood_entry = await db.client["evosan_db"]["journal_entries"].find_one({
                "created_at": {"$regex": f"^{date_str}"}
            })
            
            habit_logs = await db.client["evosan_db"]["habit_logs"].find({
                "date": date_str,
                "completed": True
            }).to_list(length=100)
            
            nutrition = await db.client["evosan_db"]["nutrition"].find_one({"date": date_str})
            workout = await db.client["evosan_db"]["workouts"].find_one({"date": date_str})

            day_data = {
                "date": date_str,
                "mood": mood_entry["mood"] if mood_entry else None,
                "habits_completed": len(habit_logs),
                "calories": nutrition["calories"] if nutrition else None,
                "protein": nutrition["protein_grams"] if nutrition else None,
                "water": nutrition["water_liters"] if nutrition else None,
                "workout_duration": workout["duration_mins"] if workout else None,
                "workout_intensity": workout["intensity"] if workout else None
            }
            data.append(day_data)

        df = pd.DataFrame(data)
        
        # Convert to numeric and handles NaNs by interpolation or fillna
        cols_to_analyze = ["mood", "habits_completed", "calories", "protein", "water", "workout_duration", "workout_intensity"]
        for col in cols_to_analyze:
            df[col] = pd.to_numeric(df[col], errors='coerce')

        # Drop rows where mood is NaN as it's our primary anchor
        df = df.dropna(subset=["mood"])
        
        if len(df) < 3: # Need at least some data points for correlation
            return {
                "correlations": {}, 
                "insights": ["Insufficient data: Please log your Mood in the Journal for at least 3 different days to unlock pattern recognition."]
            }

        # Calculate correlation matrix
        corr_matrix = df[cols_to_analyze].corr()
        
        # Extract mood correlations
        mood_corr = corr_matrix["mood"].drop("mood").to_dict()
        
        # Generate Insights
        insights = []
        for metric, val in mood_corr.items():
            if pd.isna(val): continue
            
            strength = abs(val)
            if strength > 0.6:
                sentiment = "Strongly positive" if val > 0 else "Strongly negative"
                insights.append(f"{sentiment} correlation ({val:.2f}) between Mood and {metric.replace('_', ' ').title()}.")
            elif strength > 0.3:
                sentiment = "Moderate positive" if val > 0 else "Moderate negative"
                insights.append(f"{sentiment} correlation ({val:.2f}) between Mood and {metric.replace('_', ' ').title()}.")

        return {
            "correlations": {k: float(v) if not pd.isna(v) else 0 for k, v in mood_corr.items()},
            "insights": insights[:3] # Top 3 insights
        }

correlation_service = CorrelationService()
