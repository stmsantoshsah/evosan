# 🚀 Evosan: Senior AI Upgrade Plan

This plan outlines the evolution of Evosan from a basic tracker into a sophisticated **Agentic AI System** with Long-Term Memory and Voice Intelligence.

## Phase 1: Voice Intelligence (The "Communication" Upgrade)
*Goal: Practice English while logging your day.*
- **Feature**: "Voice Journaling."
- **Stack**: Groq (Distil-Whisper model) + Web Audio API.
- **Workflow**:
    1. You record a 2-minute summary of your day in English.
    2. The backend sends the audio to **Groq's Whisper API** (Extremely fast).
    3. The transcript is analyzed for **Mood**, **Keywords**, and **Grammar Improvements**.
    4. **AI Feedback**: Evosan gives you a "Communication Confidence Score" and suggests better ways to say what you just said.

## Phase 2: Neural Memory (The "RAG" Upgrade)
*Goal: Move from 7-day memory to "Infinite Memory."*
- **Feature**: Long-Term Pattern Recognition.
- **Stack**: ChromaDB or Pinecone (Vector DB) + OpenAI/Cohere Embeddings.
- **Workflow**:
    1. Every journal entry is converted into a **Vector Embedding**.
    2. When you ask a question ("When was the last time I felt this burned out?"), the system performs a **Semantic Search**.
    3. The AI retrieves historical data to give you "Life-Cycle Insights."

## Phase 3: System Design & MLOps (The "Architecture" Upgrade)
*Goal: Show clients you can build production-grade AI.*
- **Feature**: Observability & Tracing.
- **Stack**: LangSmith + Docker + GitHub Actions.
- **Workflow**:
    1. Integrate **LangSmith** to trace every AI call. You can see the prompt, the latency, and the cost.
    2. Containerize the entire app using **Docker**.
    3. Setup a CI/CD pipeline so every code change is automatically tested and deployed.

---

## 🛠️ Step 1: Voice Journaling Implementation (Next Task)

### 1. Backend Changes (`backend/app/api/endpoints/voice.py`)
- Create an endpoint `POST /voice/journal` that accepts an `.m4a` or `.mp3` file.
- Implement the Groq Whisper client.
- Return the transcript and an initial AI "Confidence Analysis."

### 2. Frontend Changes (`frontend/src/features/journal/components/VoiceRecorder.tsx`)
- Build a sleek, "tactical" voice recorder UI with a waveform animation.
- Handle the audio stream and upload to the backend.

---

## 🏆 Why this makes you a Senior Engineer:
1. **Multi-Modal AI**: You aren't just handling text; you're handling audio.
2. **Observability**: Using LangSmith shows you care about production reliability.
3. **Productivity Loop**: You are building a tool that *forces* you to practice English every night.
