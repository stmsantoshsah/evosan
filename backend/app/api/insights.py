# backend/app/api/insights.py
from fastapi import APIRouter
from app.services.ai import generate_weekly_insight

router = APIRouter()

@router.get("/weekly")
async def get_weekly_insight():
    try:
        # returns a dict {score, pattern, friction, directive}
        insight_data = await generate_weekly_insight()
        return insight_data 
    except Exception as e:
        return {
            "score": 0,
            "pattern": "Error generating insight.",
            "friction": str(e),
            "directive": "Check system logs."
        }