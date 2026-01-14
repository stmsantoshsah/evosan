# test_parser_user.py
import asyncio
from app.services.parser import parser_service
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="d:/evosan/backend/.env")

async def test():
    user_input = "Ate 3 eggs and toast for breakfast, drank 500ml wate"
    print(f"Testing User Input: {user_input}")
    result = await parser_service.parse_input(user_input)
    print("Result:")
    print(result)

if __name__ == "__main__":
    asyncio.run(test())
