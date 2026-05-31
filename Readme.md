# 🚀 Evosan: AI-Powered Personal Growth & Habit Optimization OS
Evosan is a private, multi-modal, AI-assisted lifestyle architecture designed to optimize daily habits, analyze mental wellness patterns via voice journaling, track training physical output, and maintain long-term cognitive recall.

Built with **FastAPI**, **Next.js (App Router)**, **PostgreSQL/MongoDB**, **ChromaDB**, and **Groq (Whisper + Llama 3.3)**.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │  Next.js 14 (Frontend)  │
                       │     (Port 3000 / UI)    │
                       └────────────┬────────────┘
                                    │
                                    ▼ [REST API / Audio Uploads]
                       ┌─────────────────────────┐
                       │    FastAPI (Backend)    │
                       │    (Port 8000 / API)    │
                       └──────┬────────────┬─────┘
                              │            │
       [Data Storage]         ▼            ▼ [AI Tracing & Transcription]
                  ┌───────────┴───┐    ┌───┴────────────────────────┐
                  │    MongoDB    │    │  Groq (Whisper / Llama)    │
                  │   Chroma DB   │    │  LangSmith Observability   │
                  └───────────────┘    └────────────────────────────┘
```

---

## 🛠️ Local Development Setup

### Prerequisites
Ensure you have the following installed on your machine:
* **Python 3.10+**
* **Node.js 18+**
* **MongoDB** (Running locally on default port `27017` or a MongoDB Atlas connection string)

---

### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   # Windows (Create)
   python -m venv venv

   # Windows (Activate - PowerShell)
   .\venv\Scripts\Activate.ps1

   # Windows (Activate - Git Bash / MINGW64)
   source venv/Scripts/activate

   # macOS/Linux (Create & Activate)
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt  
   ```

4. Configure your environment variables:
   * Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in your details (especially `GROQ_API_KEY` and database credentials).

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * The API will be live at: [http://localhost:8000](http://localhost:8000)
   * The interactive API docs (Swagger) will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Frontend Setup (Next.js 14)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   * Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Ensure `NEXT_PUBLIC_API_URL` is pointed to your local backend server:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

4. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   * Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Running with Docker (Recommended for Production)

To spin up the entire multi-container environment (MongoDB database + FastAPI backend + Next.js UI) with a single command:

1. Ensure Docker Desktop is running on your machine.
2. At the root directory `/evosan`, run:
   ```bash
   docker-compose up --build
   ```
3. Docker will automatically pull the required database images, build the custom backend/frontend containers, link them inside a secure local network, and launch the entire ecosystem!
