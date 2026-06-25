# backend/app/api/chat_api.py
import shutil
from collections.abc import AsyncGenerator
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from app.services.ai.chatbot import chatbot_agent
from app.services.ai.client import chat_model
from app.services.ai.transcription import transcribe_audio_file

router = APIRouter()

TEMP_DIR = Path("temp_audio")
TEMP_DIR.mkdir(exist_ok=True)


@router.post("/stream")
async def stream_chat_response(
    message: str = Form(...),
    user_id: str = Form("default_user")
):
    """
    Accepts text input, executes the stateful LangGraph coaching agent,
    and streams Llama's tokens back to the frontend in real-time.
    """
    if not message.strip():
        raise HTTPException(status_code=400, detail="Empty query prompt")

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # 1. Run the LangGraph to collect context (retrieval phase)
            # This is extremely fast because it runs local SQL / metrics gathers
            state = await chatbot_agent.ainvoke({
                "messages": [HumanMessage(content=message)],
                "user_id": user_id
            })

            # Extract generated context metrics
            context = state.get("context", {})
            recent_habits = context.get("recent_habits", "None logged")
            weekly_score = context.get("weekly_score", "75/100")
            past_journals = context.get("past_journals", "None logged")

            # 2. Build system prompt to stream ChatGroq directly
            system_prompt = f"""
            You are 'Evosan', an elite, tactical Senior Architectural Coach and AI Mentor.
            Your client is Santosh Sah, a Senior Software Engineer specializing in backend architectures, NestJS, Python, and AI integrations, who is working on executive verbal presence, English shadowing, and MLOps platform mastery.

            === USER STATE CONTEXT ===
            - Habits: {recent_habits}
            - Score: {weekly_score}
            - Recent Memories: {past_journals}

            === CONVERSATIONAL PROTOCOLS ===
            1. **Style**: Be direct, crisp, and high-impact. Use system/military analogies (e.g., 'Protocol Optimized', 'Friction Detected', 'Directives Established').
            2. **Standup Feedback**: If they present a standup or verbal practicing query, evaluate it directly on executive clarity (Pacing, vocabulary upgrades, CAR framework: Context ➔ Action ➔ Result).
            3. **Brevity**: Keep answers under 150 words. Avoid fluff. Use bold markers and bullet points for structural delivery.
            4. Never say "As an AI...". You are the Evosan system operating system.
            5. **Contextual Relevance**: Always answer/acknowledge the user's specific query or greeting directly first. Do not dump status metrics or bring up 'Friction Detected' unless it directly relates to what the user asked.
            """

            # Combine messages for LLM completion
            # Fetch message history from state (excluding the system message we will override here)
            history = list(state.get("messages", []))
            if history and isinstance(history[-1], AIMessage):
                history.pop()
            llm_messages = [SystemMessage(content=system_prompt)] + history

            # 3. Stream token completion in real-time
            async for chunk in chat_model.astream(llm_messages):
                yield chunk.content

        except Exception as e:
            print(f"Error in FastAPI chatbot streaming generator: {e}")
            yield f"\n[System Processing Fault: {str(e)}]"

    return StreamingResponse(event_generator(), media_type="text/plain")


@router.post("/voice")
async def process_voice_chat(
    file: UploadFile = File(...),
    user_id: str = Form("default_user")
):
    """
    Accepts a compressed WebM/WAV voice recording:
    1. Transcribes the audio using Groq Whisper.
    2. Executes the stateful LangGraph workflow on the transcript.
    3. Returns the transcription text and coaching responses.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No audio file uploaded")

    file_path = TEMP_DIR / file.filename

    try:
        # 1. Save upload temporarily
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Transcribe voice using our decoupled Whisper service
        transcript = await transcribe_audio_file(file_path, file.filename)

        if not transcript.strip():
            raise HTTPException(status_code=422, detail="Vocal amplitude too low to transcribe")

        # 3. Execute stateful chatbot agent
        state = await chatbot_agent.ainvoke({
            "messages": [HumanMessage(content=transcript)],
            "user_id": user_id
        })

        # 4. Extract response from final graph message
        final_message = state["messages"][-1].content

        return {
            "transcript": transcript,
            "response": final_message,
            "user_id": user_id
        }

    except Exception as e:
        print(f"Voice Chat API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e

    finally:
        # Clean up local temporary file
        if file_path.exists():
            file_path.unlink()
