import resend

from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_password_reset_email(to_email: str, token: str):
    """
    Sends a password reset email using Resend.
    """
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Reset Your Evosan Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your Evosan account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">&copy; 2024 Evosan Health. All rights reserved.</p>
    </div>
    """

    try:
        params = {
            "from": settings.EMAIL_FROM,
            "to": to_email,
            "subject": "Reset your Evosan Password",
            "html": html_content,
        }

        email = resend.Emails.send(params)
        return email
    except Exception as e:
        print(f"Error sending email: {e}")
        return None
