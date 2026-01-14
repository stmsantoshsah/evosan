# backend/app/services/parser.py
import json
from groq import Groq
from app.core.config import settings

class ParserService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.system_prompt = """
        You are a health and fitness data extractor. Your job is to take natural language input from a user and extract structured data for their nutrition and workout logs.

        The user might describe what they ate, how much water they drank, or the workout they performed.

        ### Output Format
        You MUST return a JSON object with the following structure. If a field is not found, use null (for strings) or 0 (for numbers).

        {
          "nutrition": {
            "calories": integer,
            "protein_grams": integer,
            "water_liters": float,
            "notes": "string description of meals"
          },
          "workout": {
            "routine_name": "string",
            "duration_mins": integer,
            "exercises": "string details of exercises",
            "intensity": integer (1-10)
          }
        }

        ### Constraints:
        - Nutrition: Estimate calories and protein if the user provides meal descriptions but no numbers.
        - Water: Convert ml/oz to liters.
        - Workout: Summarize exercises into a readable string. Estimate intensity (1-10) based on the description if not explicitly stated.
        - ONLY return the JSON object. No extra text.
        """

    async def parse_input(self, user_input: str):
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": self.system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_input,
                    }
                ],
                model="llama3-70b-8192",
                response_format={"type": "json_object"},
            )
            
            result = json.loads(chat_completion.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Error parsing input with Groq: {e}")
            return None

parser_service = ParserService()
