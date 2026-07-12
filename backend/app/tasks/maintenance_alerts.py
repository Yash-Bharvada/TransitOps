from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.driver import Driver, DriverStatus
from app.tasks.email_tasks import send_email
import logging
from datetime import date, timedelta

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.maintenance_alerts.check_maintenance")
def check_maintenance():
    """
    Checks for vehicles needing maintenance and drivers with expiring licenses.
    """
    db = SessionLocal()
    try:
        # Example logic: Find drivers with license expiring in 30 days
        expiry_threshold = date.today() + timedelta(days=30)
        expiring_drivers = db.query(Driver).filter(
            Driver.license_expiry <= expiry_threshold,
            Driver.status != DriverStatus.Suspended
        ).all()
        
        for driver in expiring_drivers:
            send_email.delay(
                to="admin@transitops.com",
                subject=f"Alert: Driver License Expiring - {driver.name}",
                body=f"License {driver.license_number} is expiring on {driver.license_expiry}."
            )
            
        logger.info(f"Checked maintenance. Found {len(expiring_drivers)} expiring licenses.")
        return {"status": "success", "drivers_alerted": len(expiring_drivers)}
    finally:
        db.close()
