# Chat API endpoint for AI-powered todo management

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session

from ..auth import get_current_user, JWTPayload
from ..models import ChatRequest, ChatResponse
from ..services.chat import chat_service
from ..db import get_session

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> ChatResponse:
    """
    AI-powered chat endpoint for managing todos through natural language.

    Handles both new conversations and existing ones.
    All conversation history is persisted to the database.
    """
    return await chat_service.handle_message(
        message=request.message,
        user_id=current_user.user_id,
        conversation_id=request.conversation_id,
        session=session,
    )


@router.get("/conversations")
async def list_conversations(
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """List all conversations for the current user."""
    from sqlmodel import select
    from ..models import Conversation

    conversations = session.exec(
        select(Conversation)
        .where(Conversation.user_id == current_user.user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()

    return [
        {
            "id": conv.id,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
            "message_count": len(conv.messages) if hasattr(conv, "messages") else 0,
        }
        for conv in conversations
    ]


@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: int,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get a specific conversation with all messages."""
    from sqlmodel import select
    from ..models import Conversation, Message

    conversation = session.exec(
        select(Conversation)
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.user_id,
        )
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()

    return {
        "id": conversation.id,
        "user_id": conversation.user_id,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "created_at": m.created_at,
                "tool_calls": m.tool_calls,
            }
            for m in messages
        ],
    }
