import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "GeM SmartBid AI"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./gem_smartbid.db")
    
    # Security & CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "https://*.vercel.app"
    ]
    
    # Optional LLM Configuration
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
    
    # Upload config
    MAX_UPLOAD_SIZE_MB: int = 10
    UPLOAD_DIR: str = os.path.join(os.path.dirname(__file__), "..", "uploads")

settings = Settings()
