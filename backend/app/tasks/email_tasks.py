from app.tasks.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.email_tasks.send_email")
def send_email(to: str, subject: str, body: str):
    """
    Mock implementation for sending an email.
    In a real app, this would use an SMTP library or API like SendGrid/SES.
    """
    logger.info(f"Sending email to {to}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body: {body}")
    return {"status": "success", "message": f"Email sent to {to}"}
