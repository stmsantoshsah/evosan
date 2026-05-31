# backend/app/services/ai/chatbot.py
from collections.abc import Sequence
from typing import Annotated, TypedDict

from langchain_core.messages import AIMessage, BaseMessage, SystemMessage
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

from app.db.supabase_db import supabase_db
from app.services.ai.client import chat_model


# 1. Define the state object flowing through the graph nodes
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    context: dict
    user_id: str


# 2. Node A: Retrieve Context from Supabase to ground the conversation
async def retrieve_supabase_context(state: AgentState) -> dict:
    """
    Queries Supabase database tables to gather the user's recent habit compliance,
    weekly scores, and historical journal sentiment to ground the conversation.
    """
    user_id = state.get("user_id", "default_user")
    context_data = {
        "recent_habits": "No habits tracked in Supabase yet.",
        "weekly_score": "No optimization score logged.",
        "past_journals": "No historical memory found."
    }

    # Fallback to local default metrics if Supabase is uninitialized
    if not supabase_db.client:
        return {"context": context_data}

    try:
        # Fetch habits
        habits_res = await supabase_db.client.from_("habit_logs").select("*").eq("user_id", user_id).limit(5).execute()
        if habits_res.data:
            done_habits = [h.get("name", "Habit") for h in habits_res.data if h.get("completed")]
            context_data["recent_habits"] = f"Completed recently: {', '.join(done_habits) if done_habits else 'None'}"

        # Fetch optimization score
        stats_res = await supabase_db.client.from_("weekly_insights").select("score").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        if stats_res.data:
            context_data["weekly_score"] = f"Current Weekly Optimization Score: {stats_res.data[0].get('score', 75)}/100"

        # Fetch latest journals
        journals_res = await supabase_db.client.from_("journal_entries").select("content").eq("user_id", user_id).limit(2).execute()
        if journals_res.data:
            past_texts = [j.get("content", "")[:120] for j in journals_res.data]
            context_data["past_journals"] = f"User thoughts recently: {'; '.join(past_texts)}"

    except Exception as e:
        print(f"Error gathering Supabase context in chatbot node: {e}")

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
workflow.add_node("retrieve_context", retrieve_supabase_context)
workflow.add_node("generate_response", generate_coaching_response)

# Connect flow step by step
workflow.set_entry_point("retrieve_context")
workflow.add_edge("retrieve_context", "generate_response")
workflow.add_edge("generate_response", END)

# Compile into a single executable engine
chatbot_agent = workflow.compile()
print("LangGraph Stateful Chatbot Agent compiled and operational")
