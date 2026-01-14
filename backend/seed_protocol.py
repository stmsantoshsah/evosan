import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    # Fallback/Error if env not loaded correctly from script context
    print("Error: MONGODB_URL not found in env.")
    exit(1)

DB_NAME = os.getenv("DB_NAME", "evosan_db")

HABITS = [
    # 🌅 BOOT SEQUENCE (Health)
    {"name": "Hydrate (500ml + Salt)", "category": "health"},
    {"name": "Morning Sunlight (10m)", "category": "health"},
    {"name": "Workout (Lift or Run)", "category": "health"},

    # 🧠 DEEP WORK PROTOCOL (Learning)
    {"name": "Deep Work (2 Hours)", "category": "learning"},
    {"name": "Coding Practice (DSA/Project)", "category": "learning"},
    {"name": "Read Documentation/Articles", "category": "learning"},

    # 🌙 SYSTEM SHUTDOWN (Mindset/Creation -> Shutdown)
    {"name": "Plan Tomorrow's Tasks", "category": "mindset"},
    {"name": "No Screens after 10 PM", "category": "mindset"},
    {"name": "Journal Entry", "category": "mindset"},
]

async def seed():
    print("Connecting to DB...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    
    collection = db["habits"]
    
    print("Seeding Protocol...")
    added = 0
    skipped = 0
    
    for h in HABITS:
        # Check if exists
        existing = await collection.find_one({"name": h["name"]})
        if existing:
            print(f"Skipped: {h['name']} (Exists)")
            skipped += 1
        else:
            await collection.insert_one(h)
            print(f"Added: {h['name']}")
            added += 1
            
    print(f"\nDone. Added: {added}, Skipped: {skipped}")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
