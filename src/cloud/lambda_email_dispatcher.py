"""
TraffiQ — MIT-ADT Campus Smart Traffic & Gate Monitoring System
Module: AWS Lambda Email Dispatcher (TraffiQ_Email_Dispatcher)
Runtime: Python 3.11 / AWS Lambda (ap-south-1 Mumbai)

Dispatches branded 6-digit OTP verification codes via Gmail SMTP (SSL 465)
for Account Registration and Password Recovery.
"""

import json
import os
import re
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

GMAIL_SENDER = os.environ.get("GMAIL_SENDER_EMAIL", "")
GMAIL_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
}


def build_html_body(email: str, otp: str, purpose: str, recipient_name: str) -> str:
    is_reset = purpose.upper() == "RESET"
    action_title = "Password Reset Request" if is_reset else "Account Verification"
    action_desc = (
        "We received a request to reset the password for your TraffiQ account."
        if is_reset
        else "Thank you for registering with TraffiQ Smart Campus Transit."
    )
    instruction = (
        "Enter the 6-digit security code below in your mobile app to reset your password:"
        if is_reset
        else "Enter the 6-digit security code below to verify your email and activate your access:"
    )

    greeting = f"Hello {recipient_name}," if recipient_name else "Hello,"

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TraffiQ Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;" cellspacing="0" cellpadding="0">
          
          <!-- Header Bar -->
          <tr>
            <td style="background:#4B168C;padding:24px 28px;text-align:center;">
              <h1 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:900;letter-spacing:-0.5px;">
                Traffi<span style="color:#D6A52A;">Q</span>
              </h1>
              <p style="margin:4px 0 0;color:#E9D5FF;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">
                MIT-ADT University • Rajbaug Campus
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 20px;">
              <h2 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#0F172A;">
                {action_title}
              </h2>
              <p style="margin:0 0 16px;font-size:13.5px;color:#475569;line-height:1.5;">
                {greeting}<br>
                {action_desc} {instruction}
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;">
                <tr>
                  <td align="center" style="background:#F7F4FB;border:1.5px dashed #C084FC;border-radius:12px;padding:18px;">
                    <div style="font-size:11px;font-weight:700;color:#6B21A8;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">
                      Your One-Time Password (OTP)
                    </div>
                    <div style="font-size:32px;font-weight:900;letter-spacing:8px;color:#4B168C;font-family:monospace;">
                      {otp}
                    </div>
                    <div style="font-size:11px;color:#64748B;margin-top:6px;">
                      ⏱ Valid for the next 5 minutes
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;font-size:12px;color:#64748B;line-height:1.5;">
                If you did not request this verification code, please disregard this email or contact Campus Security. Do not share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:16px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:500;">
                TraffiQ Smart Campus Traffic & Main Gate Commute System<br>
                MIT Art, Design and Technology University, Pune
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def lambda_handler(event, context):
    """
    AWS Lambda entry point for dispatching OTP verification emails via Gmail.
    """
    # 1. Handle CORS Preflight (OPTIONS)
    http_method = event.get("requestContext", {}).get("http", {}).get("method") or event.get("httpMethod")
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"status": "ok"}),
        }

    # 2. Parse Request Body
    raw_body = event.get("body", "")
    if isinstance(raw_body, str) and raw_body:
        try:
            body = json.loads(raw_body)
        except Exception:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"success": False, "error": "Invalid JSON payload"}),
            }
    elif isinstance(raw_body, dict):
        body = raw_body
    else:
        body = event

    recipient_email = body.get("email", "").strip().lower()
    otp_code = str(body.get("otp", "")).strip()
    purpose = body.get("purpose", "SIGNUP").strip().upper()
    recipient_name = body.get("name", "").strip()

    # 3. Validate Inputs
    email_regex = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not recipient_email or not re.match(email_regex, recipient_email):
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"success": False, "error": "Invalid recipient email address"}),
        }

    if not otp_code or len(otp_code) != 6 or not otp_code.isdigit():
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"success": False, "error": "Invalid 6-digit OTP code"}),
        }

    # 4. Check Gmail Credentials
    sender_clean = GMAIL_SENDER.strip()
    password_clean = GMAIL_PASSWORD.strip().replace(" ", "")

    if not sender_clean or not password_clean:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": False,
                "error": "Gmail sender credentials not configured on server",
            }),
        }

    # 5. Build Email Message
    subject_prefix = "Password Reset Code" if purpose == "RESET" else "Verification Code"
    subject = f"[TraffiQ] Your {subject_prefix}: {otp_code}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"TraffiQ MIT-ADT <{sender_clean}>"
    msg["To"] = recipient_email

    # Plaintext fallback
    plain_text = f"Your TraffiQ verification code is: {otp_code}\nValid for 5 minutes.\nMIT-ADT University."
    html_content = build_html_body(recipient_email, otp_code, purpose, recipient_name)

    msg.attach(MIMEText(plain_text, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # 6. Dispatch via Gmail SMTP (SSL 465) with 5s timeout
    try:
        ssl_context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ssl_context, timeout=6) as server:
            server.login(sender_clean, password_clean)
            server.sendmail(sender_clean, [recipient_email], msg.as_string())

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": True,
                "message": f"Verification code successfully dispatched to {recipient_email}",
                "recipient": recipient_email,
            }),
        }

    except smtplib.SMTPAuthenticationError as auth_err:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": False,
                "error": "SMTP Authentication failed. Verify Google App Password.",
                "details": str(auth_err),
            }),
        }
    except Exception as exc:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": False,
                "error": f"Failed to dispatch email: {str(exc)}",
            }),
        }

