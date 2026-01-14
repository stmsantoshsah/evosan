# check_stats.py
import asyncio
from app.api.stats import get_weekly_stats
from app.db.database import connect_to_mongo, close_mongo_connection
from dotenv import load_dotenv
import json

load_dotenv(dotenv_path="d:/evosan/backend/.env")

async def test():
    await connect_to_mongo()
    print("Testing Weekly Stats API...")
    try:
        results = await get_weekly_stats()
        print(json.dumps(results, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(test())
