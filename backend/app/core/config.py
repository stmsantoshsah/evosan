# backend\app\core\config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL:str
    DB_NAME:str
    GROQ_API_KEY:str
    SECRET_KEY: str = "your-secret-key-goes-here" # In production, use a strong secret
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file=".env"
        extra="ignore"
    
settings = Settings()