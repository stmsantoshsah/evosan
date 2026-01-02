# evosan/backend/app/db/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client:AsyncIOMotorClient = None

db=Database()

async def get_database():
    return db.client[settings.DB_NAME]

async def connect_to_mongo():
    db.client =AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB")

async def close_mongo_connection():
    db.client.close()
    print("Disconnected from MongoDB")