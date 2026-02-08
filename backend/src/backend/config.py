# T010: Backend configuration management with pydantic-settings

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from pathlib import Path
import os


def find_env_file() -> Path:
    """Find .env file by searching up from current directory."""
    current = Path.cwd()
    while current != current.parent:
        env_path = current / ".env"
        if env_path.exists():
            return env_path
        current = current.parent
    # Fallback to default locations
    for path in [Path.cwd() / ".env", Path.cwd().parent / ".env"]:
        if path.exists():
            return path
    return Path(".env")


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Find .env file dynamically
    _env_file = find_env_file()

    model_config = SettingsConfigDict(
        env_file=str(_env_file),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str

    # JWT Authentication
    better_auth_secret: str

    # Server (use PORT from cloud providers like Render/Railway)
    backend_port: int = int(os.getenv("PORT", "8000"))
    backend_host: str = "0.0.0.0"

    # CORS (will be updated based on environment)
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # AI API (supports both GEMINI_API_KEY and OPENAI_API_KEY)
    gemini_api_key: str
    openai_api_key: str

    @property
    def jwt_algorithm(self) -> str:
        """JWT algorithm for token verification."""
        return "HS256"

    @property
    def ai_api_key(self) -> str:
        """Get the available AI API key (Gemini preferred)."""
        # Check for GEMINI_API_KEY first (as user requested), fallback to OPENAI_API_KEY
        if self.gemini_api_key and self.gemini_api_key != "your-gemini-api-key-here":
            return self.gemini_api_key
        return self.openai_api_key


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Use this function to access settings throughout the application.
    """
    return Settings()


# Export for easy access
settings = get_settings()
