# backend/app/db/database_serverless.py
# Serverless-friendly database connection for Vercel

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    _initialized = False

db = Database()

async def get_database():
    """Lazy initialization for serverless environments"""
    if not db._initialized:
        await connect_to_mongo()
    return db.client[settings.DB_NAME]

async def connect_to_mongo():
    """Connect to MongoDB (called on-demand in serverless)"""
    if db.client is None:
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000,
            maxPoolSize=1,  # Important for serverless
            minPoolSize=0
        )
        db._initialized = True
        print("Connected to MongoDB (Serverless)")

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        db._initialized = False
        print("Disconnected from MongoDB")
