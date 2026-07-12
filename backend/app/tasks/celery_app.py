from celery import Celery
from app.config import settings

celery_app = Celery(
    "transitops_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.task_routes = {
    "app.tasks.email_tasks.send_email": "main-queue",
    "app.tasks.maintenance_alerts.check_maintenance": "main-queue"
}

# Example of a periodic task setup
# celery_app.conf.beat_schedule = {
#     "check-maintenance-daily": {
#         "task": "app.tasks.maintenance_alerts.check_maintenance",
#         "schedule": 86400.0, # Every 24 hours
#     }
# }
