# backend/app/services/ai/client.py
from groq import AsyncGroq
from langchain_groq import ChatGroq

from app.core.config import settings

print("Initializing AI client singletons...")

# 1. Standard low-level asynchronous client for Groq API (transcriptions, raw calls)
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

# 2. High-level LangChain-integrated ChatGroq model instance for LangGraph integration
chat_model = ChatGroq(
    groq_api_key=settings.GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
    temperature=0.6
)

print("AI client singletons initialized successfully")
