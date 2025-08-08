from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)


async def send_verification_email(email: str, token: str):
    # ✅ Use your real domain in production
    verification_link = f"http://localhost:8000/auth/verify-email?token={token}"

    # ✅ Plain text fallback
    plain_text = (
        f"Hi,\n\n"
        f"Thanks for signing up! Please verify your email by clicking the link below:\n"
        f"{verification_link}\n\n"
        "If you didn’t create an account, you can ignore this email."
    )

    # ✅ HTML content (looks like a real email)
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hi,</p>
        <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
        <p>
          <a href="{verification_link}"
             style="display:inline-block;padding:12px 20px;background:#007bff;color:white;
                    text-decoration:none;border-radius:5px;font-weight:bold;">
            ✅ Verify Email
          </a>
        </p>
        <p>If you didn’t create an account, you can safely ignore this email.</p>
        <hr>
        <small style="color:#888;">This email was sent automatically. Please do not reply.</small>
      </body>
    </html>
    """

    message = MessageSchema(
        subject="Please Verify Your Email",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html  # ✅ send as HTML
    )

    fm = FastMail(conf)
    await fm.send_message(message)

async def send_reset_password_email(email: str, token: str):
    reset_link = f"http://localhost:8000/auth/reset-password?token={token}"

    html_content = f"""
    <html>
      <body>
        <p>Hi,</p>
        <p>You requested a password reset. Click below to set a new password:</p>
        <a href="{reset_link}" 
           style="background:#007bff;color:white;padding:10px 15px;text-decoration:none;">
           Reset Password
        </a>
        <p>This link will expire in 15 minutes. If you didn’t request it, you can ignore this email.</p>
      </body>
    </html>
    """

    message = MessageSchema(
        subject="Reset your password",
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)


