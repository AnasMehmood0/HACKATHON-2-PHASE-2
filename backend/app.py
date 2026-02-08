import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Import and expose the FastAPI app
from backend.main import app

__all__ = ["app"]
