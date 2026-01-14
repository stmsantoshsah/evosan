# backend/app/api/correlations.py
from fastapi import APIRouter, HTTPException
from app.services.correlations import correlation_service

router = APIRouter()

@router.get("/")
async def get_correlations(days: int = 30):
    try:
        result = await correlation_service.get_correlation_data(days)
        return result
    except Exception as e:
        print(f"Error calculating correlations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during correlation calculation")
