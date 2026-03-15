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
    print("Connecting to MongoDB (Aggressive Mode)...")
    try:
        # FORCE SSL VERIFICATION OFF
        # This ignores certificate errors and is the strongest way to test connectivity
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        
        # Test the connection immediately
        await db.client.admin.command('ping')
        print("Connected to MongoDB Successfully")
        
        # Initialize Indexes
        evosan_db = db.client[settings.DB_NAME]
        
        # Habit Logs Indexes
        await evosan_db["habit_logs"].create_index([("date", -1)])
        await evosan_db["habit_logs"].create_index([("habit_id", 1), ("date", -1)])
        await evosan_db["habit_logs"].create_index([("completed", 1), ("date", -1)])

        # Journal Entries Indexes
        await evosan_db["journal_entries"].create_index([("created_at", -1)])
        
        # Nutrition and Workouts Indexes
        await evosan_db["nutrition"].create_index([("date", -1)])
        await evosan_db["workouts"].create_index([("date", -1)])
        
        print("MongoDB Indexes Initialized")
        
    except Exception as e:
        print(f"CONNECTION FAILED: {e}")
        print("ACTION REQUIRED: Check your MongoDB Atlas Network Access IP Whitelist.")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")