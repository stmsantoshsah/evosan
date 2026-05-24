import asyncio
import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient


async def check_users():
    load_dotenv()
    mongodb_url = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "evosan_db")

    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]

    users_count = await db["users"].count_documents({})
    print(f"Total Users in Local Database: {users_count}")

    if users_count > 0:
        cursor = db["users"].find({})
        async for user in cursor:
            print(f"- Email: {user['email']}")
    else:
        print("The database is currently EMPTY.")


if __name__ == "__main__":
    asyncio.run(check_users())
