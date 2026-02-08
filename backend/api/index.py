# Vercel serverless function entry point for FastAPI backend
import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

# Import the FastAPI app
from backend.main import app

# Vercel looks for this handler
handler = app
