# Vercel serverless function entry point for FastAPI backend
import sys
from pathlib import Path

# Add src directory to Python path
src_path = str(Path(__file__).parent.parent / "src")
if src_path not in sys.path:
    sys.path.insert(0, src_path)

# Import the FastAPI app
from backend.main import app

# Vercel Python ASGI handler
from vercel_python import ASGI

# Create the handler
handler = ASGI(app)
