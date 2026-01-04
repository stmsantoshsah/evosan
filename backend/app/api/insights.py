# backend/app/api/insights.py
from fastapi import APIRouter
from app.services.ai import generate_weekly_insight

router = APIRouter()

@router.get("/weekly")
async def get_weekly_insight():
    try:
        insight = await generate_weekly_insight()
        return {"insight": insight}
    except Exception as e:
        return {"insight": "System currently unable to generate insights.", "error": str(e)}