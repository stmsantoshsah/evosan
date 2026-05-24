# backend\app\core\config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URL: str = ""
    DB_NAME: str = "evosan_db"
    GROQ_API_KEY: str = ""
    SECRET_KEY: str = "your-secret-key-goes-here"  # In production, use a strong secret
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Email Settings
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "onboarding@resend.dev"  # Required for free tier testing
    FRONTEND_URL: str = "http://localhost:3000"  # For reset links

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
