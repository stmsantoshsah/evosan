# backend/app/api/parse.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.parser import parser_service

router = APIRouter()

class ParseRequest(BaseModel):
    text: str

@router.post("/")
async def parse_text(request: ParseRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    result = await parser_service.parse_input(request.text)
    
    if not result:
        raise HTTPException(status_code=500, detail="Failed to parse input")
    
    return result
