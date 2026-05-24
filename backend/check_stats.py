# check_stats.py
import asyncio
import json

from dotenv import load_dotenv

from app.api.stats import get_weekly_stats
from app.db.database import close_mongo_connection, connect_to_mongo

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
