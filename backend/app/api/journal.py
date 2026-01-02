from fastapi import APIRouter,HTTPException,status
from app.db.database import db
from app.models.journal import JournalEntry
from typing import List

router = APIRouter()

@router.post("/",status_code=status.HTTP_201_CREATED)

async def create_journal_entry(entry:JournalEntry):
    # Convert Pydantic model to dict
    entry_dic=entry.dict()

    # Insert into MongoDB collection named ="Journal_entries"
    new_entry = await db.client["evosan_db"]["journal_entries"].insert_one(entry_dic)

    return {"id":str(new_entry.inserted_id),"message":"Journal entry created"}

@router.get("/",response_model=List[JournalEntry])
async def get_journal_entries():
    # Fetch all entries, sort by date(newest first),limit to 20
    entries = await db.client["evosan_db"]["journal_entries"].find().sort("created_at",-1).to_list(20)
    return entries  



