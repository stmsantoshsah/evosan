# backend/app/services/ai/chatbot.py
from collections.abc import Sequence
from datetime import datetime, timedelta
from typing import Annotated, TypedDict

from langchain_core.messages import AIMessage, BaseMessage, SystemMessage
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

from app.db.database import db
from app.services.ai.client import chat_model


# 1. Define the state object flowing through the graph nodes
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    context: dict
    user_id: str


# 2. Node A: Retrieve Context from MongoDB to ground the conversation
async def retrieve_mongodb_context(state: AgentState) -> dict:
    """
    Queries MongoDB database tables to gather the user's recent habit compliance,
    weekly scores, and historical journal sentiment to ground the conversation.
    """
    _ = state
    context_data = {
        "recent_habits": "No habits tracked in MongoDB yet.",
        "weekly_score": "No optimization score logged.",
        "past_journals": "No historical memory found."
    }

    if not db.client:
        return {"context": context_data}

    try:
        # A. Fetch habits mapping (habit_id -> name)
        habits_cursor = db.client["evosan_db"]["habits"].find()
        habits = await habits_cursor.to_list(length=100)
        habit_map = {str(h["_id"]): h["name"] for h in habits}

        # B. Fetch recent completed habit logs
        logs_cursor = db.client["evosan_db"]["habit_logs"].find({"completed": True}).sort("date", -1).limit(5)
        logs = await logs_cursor.to_list(length=5)
        done_habits = [habit_map[log["habit_id"]] for log in logs if log["habit_id"] in habit_map]
        context_data["recent_habits"] = f"Completed recently: {', '.join(done_habits) if done_habits else 'None'}"

        # C. Calculate Optimization Score dynamically based on last 7 days
        # Get count of total habits defined
        total_habits_count = len(habits)

        # Get count of completed habit logs in last 7 days
        seven_days_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        completed_logs_count = await db.client["evosan_db"]["habit_logs"].count_documents({
            "date": {"$gte": seven_days_ago},
            "completed": True
        })

        # Average mood in last 7 days
        seven_days_ago_iso = (datetime.now() - timedelta(days=7)).isoformat()
        journal_cursor = db.client["evosan_db"]["journal_entries"].find({
            "created_at": {"$gte": seven_days_ago_iso}
        })
        journals_7d = await journal_cursor.to_list(length=20)
        avg_mood = sum(j.get("mood", 5) for j in journals_7d) / len(journals_7d) if journals_7d else 5.0

        # Optimization Score Calculation (Max 100):
        # 50 points max for habit consistency: (completed_logs / (total_habits * 7 days)) * 50
        # 50 points max for mood state: avg_mood * 5
        habit_score = (completed_logs_count / (total_habits_count * 7) * 50) if total_habits_count > 0 else 25.0
        mood_score = avg_mood * 5.0
        optimization_score = min(100, int(habit_score + mood_score))
        context_data["weekly_score"] = f"Current Weekly Optimization Score: {optimization_score}/100"

        # D. Fetch latest 2 journals
        journals_cursor = db.client["evosan_db"]["journal_entries"].find().sort("created_at", -1).limit(2)
        journals = await journals_cursor.to_list(length=2)
        if journals:
            past_texts = [j.get("content", "")[:120] for j in journals]
            context_data["past_journals"] = f"User thoughts recently: {'; '.join(past_texts)}"

    except Exception as e:
        print(f"Error gathering MongoDB context in chatbot node: {e}")

    return {"context": context_data}


# 3. Node B: Invoke Llama 3.3 Chat Model with systemic prompt guidelines
async def generate_coaching_response(state: AgentState) -> dict:
    """
    Combines System prompts, Supabase contextual logs, and message histories to invoke Llama.
    """
    context = state.get("context", {})
    recent_habits = context.get("recent_habits", "None logged")
    weekly_score = context.get("weekly_score", "75/100")
    past_journals = context.get("past_journals", "None logged")

    # Define the core Coaching Persona
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

    # Assemble messages
    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])

    try:
        # Call LangChain model
        response = await chat_model.ainvoke(messages)
        return {"messages": [response]}
    except Exception as e:
        print(f"Error in Llama chat model invocation: {e}")
        fallback_msg = AIMessage(content="[System Link Warning: Connection to neural processing cores interrupted. Standby for manual routing.]")
        return {"messages": [fallback_msg]}


# 4. Compile the state graph workflow
workflow = StateGraph(AgentState)

# Add our processing blocks as nodes
workflow.add_node("retrieve_context", retrieve_mongodb_context)
workflow.add_node("generate_response", generate_coaching_response)

# Connect flow step by step
workflow.set_entry_point("retrieve_context")
workflow.add_edge("retrieve_context", "generate_response")
workflow.add_edge("generate_response", END)

# Compile into a single executable engine
chatbot_agent = workflow.compile()
print("LangGraph Stateful Chatbot Agent compiled and operational")
