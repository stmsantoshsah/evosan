# backend/app/db/supabase_db.py
from postgrest import AsyncPostgrestClient

from app.core.config import settings


class SupabaseDatabase:
    client: AsyncPostgrestClient = None

    async def connect(self):
        """
        Initializes the asynchronous PostgREST client pointing to the Supabase endpoint.
        """
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            print("WARNING: SUPABASE_URL or SUPABASE_KEY is missing from environment. Supabase client skipped.")
            return

        base_url = settings.SUPABASE_URL.rstrip('/')
        rest_url = f"{base_url}/rest/v1"

        headers = {
            "apikey": settings.SUPABASE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        try:
            print(f"Initializing Supabase PostgREST client at: {rest_url}")
            self.client = AsyncPostgrestClient(rest_url, headers=headers)
            print("Supabase async connection established successfully")
        except Exception as e:
            print(f"Supabase connection error: {e}")

    async def close(self):
        """
        Closes the active HTTP client sessions safely.
        """
        if self.client:
            await self.client.aclose()
            print("Supabase async client disconnected")

supabase_db = SupabaseDatabase()
