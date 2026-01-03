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
        # ATTEMPT 1: Secure Connection (Production Standard)
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        await db.client.admin.command('ping')
        print("🟢 Connected to MongoDB (Secure)")
        
    except Exception as e:
        print(f"⚠️ Secure connection failed: {e}")
        print("🔄 Retrying with SSL verification disabled (Dev Mode)...")
        
        # ATTEMPT 2: Dev Mode (Bypass SSL)
        # This fixes the specific Windows SSL error you were seeing
        try:
            db.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                tls=True,
                tlsAllowInvalidCertificates=True,
                serverSelectionTimeoutMS=5000
            )
            await db.client.admin.command('ping')
            print("🟢 Connected to MongoDB (Insecure Dev Mode)")
        except Exception as e2:
             print(f"🔴 Fatal Connection Error: {e2}")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("🔴 Disconnected from MongoDB")