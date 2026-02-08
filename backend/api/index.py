# Vercel serverless function for FastAPI backend
import sys
from pathlib import Path

# Add src directory to Python path
src_path = str(Path(__file__).parent.parent / "src")
sys.path.insert(0, src_path)

# Import mangum for ASGI adapter
from mangum import Adapter
from backend.main import app

# Create the handler for Vercel/Lambda
handler = Adapter(app, lifespan="off")
