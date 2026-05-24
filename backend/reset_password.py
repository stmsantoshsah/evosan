import asyncio
import os

import bcrypt
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


async def reset_password(email, new_password):
    load_dotenv()
    mongodb_url = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "evosan_db")

    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]

    hashed_password = get_password_hash(new_password)

    result = await db["users"].update_one(
        {"email": email}, {"$set": {"hashed_password": hashed_password}}
    )

    if result.modified_count > 0:
        print(f"SUCCESS: Password for {email} has been reset to: {new_password}")
    else:
        print(f"FAILED: Could not find user with email {email}")


if __name__ == "__main__":
    email = "yousilenceplease@gmail.com"
    new_password = "Admin@123"  # Temporary password
    asyncio.run(reset_password(email, new_password))
