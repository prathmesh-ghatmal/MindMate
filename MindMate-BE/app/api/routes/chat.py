from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
import pdfkit
from fastapi.responses import FileResponse
from pytz import timezone  # ✅ Added for IST conversion
from app.db.database import get_db
from app.db import models 
from app.schemas import chat as schemas
from app.services.encryption import encrypt_message, decrypt_message
from app.services.gpt_client import get_mental_health_reply, summarize_conversation
from app.dependencies.auth import get_current_user
from app.db.models import User 
from fastapi import HTTPException, status

# ✅ Define IST timezone
IST = timezone("Asia/Kolkata")

router = APIRouter(prefix="/chat", tags=["chat"])

# ========================
# ✅ Chat Message Endpoint
# ========================


@router.post("/send", response_model=schemas.ChatResponse)
async def send_message(
    req: schemas.ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # 🔐 Check if conversation exists
    convo = db.query(models.Conversation).get(req.conversation_id)
    if not convo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    # 🔐 Check if conversation belongs to current user
    if convo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this conversation"
        )

    # ✅ Save user message
    user_msg = models.Message(
        conversation_id=req.conversation_id,
        sender="user",
        encrypted_text=encrypt_message(req.message)
    )
    db.add(user_msg)
    db.commit()

    # ✅ Fetch last messages for context
    past_msgs = (
        db.query(models.Message)
        .filter_by(conversation_id=req.conversation_id)
        .order_by(models.Message.created_at)
        .all()
    )
    context_messages = [
        {"sender": m.sender, "text": decrypt_message(m.encrypted_text)}
        for m in past_msgs
    ]

    # ✅ Get bot reply with memory
    bot_reply = await get_mental_health_reply(
        context_messages, 
        req.message, 
        summary=convo.summary
    )

    # ✅ Save bot reply
    bot_msg = models.Message(
        conversation_id=req.conversation_id,
        sender="assistant",
        encrypted_text=encrypt_message(bot_reply)
    )
    db.add(bot_msg)
    db.commit()

    # ✅ Update conversation summary
    new_summary = await summarize_conversation(
        context_messages + [{"sender": "assistant", "text": bot_reply}]
    )
    convo.summary = new_summary
    convo.updated_at = datetime.utcnow()
    db.commit()

    return {"reply": bot_reply}


# ==============================
# ✅ Get All Messages in a Chat
# ==============================
@router.get("/{conversation_id}/messages")
def get_conversation_messages(conversation_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # 🔐 Check if conversation exists
    convo = db.query(models.Conversation).get(conversation_id)
    if not convo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    # 🔐 Check if conversation belongs to current user
    if convo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this conversation"
        )
    msgs = (
        db.query(models.Message)
        .filter(models.Message.conversation_id == conversation_id)
        .order_by(models.Message.created_at)
        .all()
    )
    
    response = [
        {
            "id": str(m.id),
            "role": "assistant" if m.sender in ("assistant", "bot") else "user",
            "content": decrypt_message(m.encrypted_text),
            "timestamp": m.created_at.astimezone(IST).isoformat()  # ✅ IST for API too
        }
        for m in msgs
    ]
    
    return response

# =========================================
# ✅ Export Chat as WhatsApp-style PDF
# =========================================
@router.get("/{conversation_id}/export-pdf")
def export_conversation_pdf(conversation_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    convo = db.query(models.Conversation).get(conversation_id)
    if not convo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    if convo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this conversation"
        )
    messages = (
        db.query(models.Message)
        .filter_by(conversation_id=conversation_id)
        .order_by(models.Message.created_at)
        .all()
    )

    # ✅ Convert timestamps to IST before rendering
    decrypted_msgs = [
        {
            "role": "assistant" if m.sender in ("assistant", "bot") else "user",
            "text": decrypt_message(m.encrypted_text),
            "time": m.created_at.astimezone(IST).strftime("%I:%M %p"),  # ✅ IST
        }
        for m in messages
    ]

    # ✅ WhatsApp Colors
    background = "#e5ddd5"
    assistant_bubble = "#ffffff"
    user_bubble = "#dcf8c6"
    chat_date = convo.created_at.astimezone(IST).strftime("%d %B %Y")
    # ✅ Full WhatsApp-like HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{
          font-family: "Helvetica Neue", sans-serif;
          background: {background};
          margin: 0;
          padding: 20px;
        }}
        h2 {{
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }}
        .chat {{
          display: flex;
          flex-direction: column;
          gap: 10px;
        }}
        .message {{
          max-width: 65%;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.4;
          position: relative;
          word-wrap: break-word;
        }}
        .user {{
          align-self: flex-end;
          background: {user_bubble};
          color: #111;
        }}
        .assistant {{
          align-self: flex-start;
          background: {assistant_bubble};
          color: #000;
        }}
        .timestamp {{
          font-size: 10px;
          color: #777;
          text-align: right;
          margin-top: 4px;
        }}
      </style>
    </head>
    <body>
      <h2>{convo.title}</h2>
       <p style="text-align:center; font-size:12px; color:#666; margin-top:-10px; margin-bottom:20px;">
    {chat_date}
  </p>
      <div class="chat">
    """

    for msg in decrypted_msgs:
        role_class = "user" if msg["role"] == "user" else "assistant"
        text = msg["text"].replace("\n", "<br>")
        html_content += f"""
          <div class="message {role_class}">
            {text}
            <div class="timestamp">{msg['time']}</div>
          </div>
        """

    html_content += """
      </div>
    </body>
    </html>
    """

    # ✅ Generate PDF with wkhtmltopdf
    pdf_path = f"/tmp/conversation_{conversation_id}.pdf"
    pdfkit.from_string(html_content, pdf_path)

    return FileResponse(pdf_path, media_type="application/pdf", filename=f"conversation_{conversation_id}.pdf")
