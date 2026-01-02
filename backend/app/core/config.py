# backend\app\core\config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL:str
    DB_NAME:str

    class Config:
        env_file=".env"
    
settings = Settings()