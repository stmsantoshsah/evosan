# test_parser.py
import asyncio
from app.services.parser import parser_service
from dotenv import load_dotenv
import os

# Load env manually since we are running outside of FastAPI context
load_dotenv(dotenv_path="d:/evosan/backend/.env")

async def test():
    print("Testing Smart Parser...")
    user_input = "Ate 3 eggs and toast for breakfast, drank 500ml water. Did a quick 30 min run."
    result = await parser_service.parse_input(user_input)
    
    if result:
        print("Success! Result:")
        print(result)
    else:
        print("Failed to parse input. Check console for errors.")

if __name__ == "__main__":
    asyncio.run(test())
