# 🚀 Evosan: Technical Architecture Deep-Dive & Senior AI Upgrade Blueprint
**Candidate:** Santosh Sah | **Project:** Evosan (AI-Powered Life OS & Habit Optimizer)

This document provides a highly technical, production-grade review of the current **Evosan** repository and outlines the concrete, step-by-step implementation guide to execute **Phase 2 (RAG & Neural Memory)** and **Phase 3 (Observability & MLOps)**.

---

## 🏗️ Part 1: Current Architecture & Strengths

After reviewing the code in both `/backend` and `/frontend`, here is an evaluation of the system's core strengths:
1. **Asynchronous Foundations:** The backend utilizes **FastAPI (ASGI)**, which is perfect for microservices. Database operations (`motor` for MongoDB) and Groq API calls are fully asynchronous (`async`/`await`), ensuring the API thread pool never blocks during long-running LLM completions.
2. **Innovative Multi-Modal Entrypoint (`app/api/voice.py`):** The voice journaling endpoint is exceptionally well-structured. Using **Groq's Distil-Whisper-v3** provides near-instantaneous audio transcription, and the structured JSON output response format via **Llama-3.3-70b** ensures data integrity for frontend rendering.
3. **Clean Monorepo Organization:** Separation of `/frontend` (Next.js React app) and `/backend` (Python API) allows clean domain boundaries and straightforward containerization.

---

## ⚡ Part 2: The "Neural Memory" RAG Upgrade (Phase 2)

Currently, the weekly insights endpoint (`app/services/ai.py`) only queries data from the **last 7 days**. 
To give you **Infinite Memory**—allowing you to query years of logs to detect long-term behavioral patterns (e.g., *"When was the last time my sleep dropped below 6 hours and how did it affect my mood?"*)—we must implement a **Retrieval-Augmented Generation (RAG)** pipeline.

```
[User Audio/Text Journal] 
       │
       ▼
[Groq Transcription]
       │
       ▼
[SentenceTransformers (Local Embedding)] ➔ [Store in ChromaDB (Vector Store)]
                                                   │
   ┌───────────────────────────────────────────────┘
   ▼
[Semantic Query: "Show burnout patterns"] ➔ [Cosine Similarity Search] ➔ [Context injection to Llama-3.3]
```

### 1. Vector Database Choice: ChromaDB (Local & Dockerized)
Instead of paying for third-party vector databases like Pinecone, we will use **ChromaDB**. It is open-source, highly performant, and runs beautifully inside a local Docker container or inline in Python memory.

### 2. Concrete Implementation Steps
#### Step A: Install Requirements
Add the following to `backend/requirements.txt`:
```text
chromadb
sentence-transformers  # For generating high-quality local embeddings for free
```

#### Step B: Build the Embedding Service (`backend/app/services/vector_db.py`)
This service handles creating embeddings and saving them to our vector store:
```python
import chromadb
from chromadb.utils import embedding_functions
from app.core.config import settings

# 1. Initialize local embedding function (no OpenAI cost!)
local_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# 2. Connect to Chroma DB
chroma_client = chromadb.PersistentClient(path="db/chroma_data")
collection = chroma_client.get_or_create_collection(
    name="journal_embeddings", 
    embedding_function=local_ef
)

async def upsert_journal_vector(journal_id: str, content: str, mood: int, timestamp: str):
    """Saves a journal entry and its metadata to the Vector Database."""
    collection.upsert(
        documents=[content],
        metadatas=[{"mood": mood, "timestamp": timestamp}],
        ids=[journal_id]
    )

async def query_journal_memory(query_text: str, n_results: int = 3):
    """Performs a semantic similarity search across historical journals."""
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    return results
```

#### Step C: Injecting RAG Context into the Llama 3.3 Prompt
Modify your `process_voice_journal` inside `voice.py` or the insights generator to fetch historical memory:
```python
# Fetch relevant historical patterns from Chroma DB
historical_context = await query_journal_memory(transcript, n_results=2)

# Inject into the LLM prompt:
analysis_prompt = f"""
Analyze this voice journal transcript.
TRANSCRIPT: "{transcript}"

=== HISTORICAL MEMORY (RAG CONTEXT) ===
The user expressed these similar thoughts in the past:
{historical_context['documents']}

Evaluate if this represents a recurring pattern or protocol failure...
"""
```

---

## 📈 Part 3: MLOps & Production Observability (Phase 3)

To show clients and senior interviewers that you operate at an elite level, we must transition Evosan into a production-monitored system.

### 1. LangSmith Observability Integration
LangSmith allows you to trace every single LLM call, prompt iteration, latency bottleneck, and API cost.
* **How to integrate:** You don't need to change a single line of your FastAPI code! LangSmith hooks directly into the standard LangChain or raw Groq/OpenAI client calls via environment variables.

Add this to `backend/.env`:
```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY="your_langsmith_api_key"
LANGCHAIN_PROJECT="evosan-backend"
```
When you launch your FastAPI server, every Groq call is instantly plotted in a beautiful observability dashboard.

### 2. Multi-Container Orchestration (`docker-compose.yml`)
To run the entire Evosan ecosystem (frontend, backend, database) with a single command, we will place a `docker-compose.yml` file at the root of `evosan/`:

```yaml
version: '3.8'

services:
  # 1. MongoDB Database
  mongodb:
    image: mongo:latest
    container_name: evosan_mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  # 2. FastAPI Backend
  backend:
    build: ./backend
    container_name: evosan_backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app

  # 3. Next.js Frontend
  frontend:
    build: ./frontend
    container_name: evosan_frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
```

---

## 🏆 Your Evosan Senior-Developer Talking Points

When presenting Evosan in future senior engineering interviews, pitch it like this:

> *"Instead of building a simple lifestyle tracker, I designed Evosan as an **Agentic AI System**. I engineered an asynchronous, multi-modal voice processing backend in FastAPI using **Groq's Distil-Whisper** and **Llama-3.3**. To solve the short-term context window limitation, I built a local RAG pipeline using **ChromaDB** and **SentenceTransformers** for local embedding generation. The system is fully containerized using **Docker Compose** and monitored for cost and prompt latency using **LangSmith**."*
