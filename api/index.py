# Vercel serverless function entry point
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

# Import with error handling
try:
    from mangum import Adapter
    from backend.main import app

    # Create handler for AWS Lambda/Vercel
    handler = Adapter(app)
except Exception as e:
    # Return error info if import fails
    import traceback

    def handler(event, context):
        return {
            "statusCode": 500,
            "body": f"Import error: {str(e)}\n\n{traceback.format_exc()}",
            "headers": {"Content-Type": "text/plain"},
        }
