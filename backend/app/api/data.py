from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from app.db.database import db
from bson import ObjectId
from datetime import datetime, date

router = APIRouter()

def serialize_mongo_data(data):
    if isinstance(data, list):
        return [serialize_mongo_data(item) for item in data]
    if isinstance(data, dict):
        return {k: serialize_mongo_data(v) for k, v in data.items()}
    if isinstance(data, ObjectId):
        return str(data)
    if isinstance(data, (datetime, date)):
        return data.isoformat()
    # Fallback for other potential non-serializable types using string representation
    if hasattr(data, "__str__"): 
       # Be careful not to stringify basic types like int/float/bool/None which are fine
       if not isinstance(data, (int, float, bool, type(None))):
           return str(data)
    return data

@router.get("/export")
async def export_database():
    try:
        data = {}
        # List of collections to export
        collections = await db.client["evosan_db"].list_collection_names()
        
        for col_name in collections:
            cursor = db.client["evosan_db"][col_name].find()
            docs = await cursor.to_list(length=10000)
            data[col_name] = docs
            
        # Serialize ObjectIds and other BSON types
        serialized_data = serialize_mongo_data(data)
            
        return JSONResponse(content=serialized_data)
    except Exception as e:
        print(f"Export Error: {e}") 
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.delete("/reset")
async def factory_reset():
    try:
        # Drop the entire database
        await db.client.drop_database("evosan_db")
        return {"message": "Factory reset complete. System purged."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")
