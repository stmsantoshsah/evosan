# backend/app/db/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import certifi 

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    return db.client[settings.DB_NAME]

async def connect_to_mongo():
    print("🟡 Connecting to MongoDB...")
    try:
        # We add tlsCAFile=certifi.where() to fix the SSL Handshake error
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where()
        )
        # Send a ping to confirm connection
        await db.client.admin.command('ping')
        print("🟢 Connected to MongoDB Successfully")
    except Exception as e:
        print(f"🔴 Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("🔴 Disconnected from MongoDB")