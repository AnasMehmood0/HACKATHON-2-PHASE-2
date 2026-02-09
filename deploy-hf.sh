#!/bin/bash
# Deploy backend to Hugging Face Spaces

set -e

echo "🚀 Deploying to Hugging Face Spaces..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Add files
echo "📦 Adding files..."
git add Dockerfile requirements.txt src/ api/ README.md .dockerignore || true

# Commit changes
echo "💾 Committing changes..."
if git diff --quiet HEAD; then
    echo "No changes to commit"
else
    git commit -m "chore: prepare for Hugging Face Spaces deployment" || true
fi

# Prompt for space name
read -p "Enter your Hugging Face username: " HF_USERNAME
read -p "Enter your Space name: " SPACE_NAME

# Add remote if not exists
REMOTE_URL="https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"
if ! git remote get-url hf &>/dev/null; then
    echo "➕ Adding Hugging Face remote..."
    git remote add hf $REMOTE_URL
else
    echo "🔄 Updating Hugging Face remote..."
    git remote set-url hf $REMOTE_URL
fi

# Push to Hugging Face
echo "📤 Pushing to Hugging Face Spaces..."
git push hf main --force

echo "✅ Deployment started!"
echo "🌐 Your API will be available at: https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"
echo "⏳ Wait for the build to complete (check the 'Logs' tab in your Space)"
