import sys
import os
import uuid
from datetime import date, timedelta, datetime
import random
from decimal import Decimal

# Add the parent directory to the path so we can import 'app'
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal, Base, engine
from app.models.user import User, RoleEnum
from app.models.vehicle import Vehicle, VehicleType, VehicleStatus, RegionEnum
from app.models.driver import Driver, DriverStatus, LicenseCategory
from app.models.trip import Trip, TripStatus
from app.models.maintenance import Maintenance, MaintenanceStatus
from app.models.fuel_log import FuelLog
from app.models.expense import Expense, ExpenseType
from app.models.settings import Settings
from app.security import get_password_hash

def seed_db():
    print("Starting database seed...")
    
    # We will recreate the tables for a clean slate
    print("Recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Seed Settings
        settings = Settings(
            id=uuid.uuid4(),
            company_name="TransitOps India",
            currency="INR",
            distance_unit="km",
            fuel_unit="liters",
            timezone="Asia/Kolkata",
            maintenance_alert_days=7
        )
        db.add(settings)
        
        # Seed User
        admin_user = User(
            id=uuid.uuid4(),
            email="admin@transitops.in",
            password_hash=get_password_hash("admin123"),
            full_name="Rajesh Kumar",
            role=RoleEnum.admin,
            is_active=True
        )
        db.add(admin_user)
        
        # Seed Vehicles
        vehicles_data = [
            {"id": "VH-001", "registration": "MH-01-AB-1234", "name": "Tata Signa 4225.T", "type": VehicleType.Truck, "max_capacity_kg": 42000, "odometer_km": 15400, "status": VehicleStatus.Available, "acquisition_cost": Decimal("4000000"), "region": RegionEnum.West},
            {"id": "VH-002", "registration": "DL-02-CD-5678", "name": "Ashok Leyland Dost+", "type": VehicleType.Pickup, "max_capacity_kg": 1500, "odometer_km": 4200, "status": VehicleStatus.Available, "acquisition_cost": Decimal("750000"), "region": RegionEnum.North},
            {"id": "VH-003", "registration": "KA-05-EF-9012", "name": "Mahindra Bolero Pik-Up", "type": VehicleType.Pickup, "max_capacity_kg": 1700, "odometer_km": 12050, "status": VehicleStatus.Available, "acquisition_cost": Decimal("850000"), "region": RegionEnum.South},
            {"id": "VH-004", "registration": "WB-04-GH-3456", "name": "Tata Ace Gold", "type": VehicleType.Van, "max_capacity_kg": 750, "odometer_km": 8900, "status": VehicleStatus.In_Shop, "acquisition_cost": Decimal("500000"), "region": RegionEnum.East},
            {"id": "VH-005", "registration": "MH-12-IJ-7890", "name": "Maruti Suzuki Ertiga", "type": VehicleType.Sedan, "max_capacity_kg": 400, "odometer_km": 25000, "status": VehicleStatus.On_Trip, "acquisition_cost": Decimal("1100000"), "region": RegionEnum.West},
        ]
        vehicles = []
        for v in vehicles_data:
            veh = Vehicle(**v)
            db.add(veh)
            vehicles.append(veh)

        # Seed Drivers
        drivers_data = [
            {"id": "DR-001", "name": "Amit Patel", "license_number": "MH12345678901", "license_category": LicenseCategory.Class_A, "license_expiry": date.today() + timedelta(days=500), "contact": "9876543210", "safety_score": 92, "status": DriverStatus.Available},
            {"id": "DR-002", "name": "Sunil Sharma", "license_number": "DL98765432101", "license_category": LicenseCategory.Class_C, "license_expiry": date.today() + timedelta(days=250), "contact": "8765432109", "safety_score": 88, "status": DriverStatus.Available},
            {"id": "DR-003", "name": "Ramesh Kumar", "license_number": "KA56789012345", "license_category": LicenseCategory.Class_B, "license_expiry": date.today() + timedelta(days=120), "contact": "7654321098", "safety_score": 95, "status": DriverStatus.Available},
            {"id": "DR-004", "name": "Arun Singh", "license_number": "WB11223344556", "license_category": LicenseCategory.Class_A, "license_expiry": date.today() + timedelta(days=30), "contact": "9988776655", "safety_score": 75, "status": DriverStatus.Off_Duty},
            {"id": "DR-005", "name": "Priya Reddy", "license_number": "MH99887766554", "license_category": LicenseCategory.Class_C, "license_expiry": date.today() + timedelta(days=800), "contact": "9123456780", "safety_score": 99, "status": DriverStatus.On_Trip},
        ]
        drivers = []
        for d in drivers_data:
            drv = Driver(**d)
            db.add(drv)
            drivers.append(drv)
            
        db.flush() # flush so we can use vehicle/driver references
        
        # Seed Trips
        trips_data = [
            {"id": "TR-1001", "vehicle_id": "VH-001", "driver_id": "DR-001", "source": "Mumbai", "destination": "Pune", "cargo_weight_kg": 25000, "distance_km": 150, "date": date.today() - timedelta(days=2), "status": TripStatus.Completed},
            {"id": "TR-1002", "vehicle_id": "VH-002", "driver_id": "DR-002", "source": "Delhi", "destination": "Jaipur", "cargo_weight_kg": 1200, "distance_km": 280, "date": date.today() - timedelta(days=1), "status": TripStatus.Completed},
            {"id": "TR-1003", "vehicle_id": "VH-003", "driver_id": "DR-003", "source": "Bengaluru", "destination": "Mysuru", "cargo_weight_kg": 1500, "distance_km": 145, "date": date.today(), "status": TripStatus.Dispatched},
            {"id": "TR-1004", "vehicle_id": "VH-005", "driver_id": "DR-005", "source": "Mumbai", "destination": "Surat", "cargo_weight_kg": 200, "distance_km": 290, "date": date.today(), "status": TripStatus.Dispatched},
            {"id": "TR-1005", "vehicle_id": "VH-001", "driver_id": "DR-001", "source": "Pune", "destination": "Nashik", "cargo_weight_kg": 18000, "distance_km": 210, "date": date.today() + timedelta(days=1), "status": TripStatus.Pending},
        ]
        for t in trips_data:
            db.add(Trip(**t))
            
        # Seed Maintenance
        maintenance_data = [
            {"id": "MT-201", "vehicle_id": "VH-004", "description": "Engine Oil Change and Filter Replacement", "cost": Decimal("4500"), "start_date": date.today() - timedelta(days=1), "status": MaintenanceStatus.In_Progress},
            {"id": "MT-202", "vehicle_id": "VH-001", "description": "Tyre Alignment", "cost": Decimal("2000"), "start_date": date.today() - timedelta(days=15), "end_date": date.today() - timedelta(days=14), "status": MaintenanceStatus.Completed},
        ]
        for m in maintenance_data:
            db.add(Maintenance(**m))
            
        # Seed Fuel Logs
        for i in range(10):
            db.add(FuelLog(
                id=f"FL-50{i}",
                vehicle_id=random.choice(["VH-001", "VH-002", "VH-003", "VH-005"]),
                date=date.today() - timedelta(days=random.randint(1, 150)),
                liters=Decimal(str(random.randint(20, 150))),
                cost=Decimal(str(random.randint(2000, 15000))),
                odometer_km=random.randint(1000, 20000)
            ))
            
        # Seed Expenses
        expenses_data = [
            {"id": "EX-301", "description": "Mumbai-Pune Expressway Toll", "type": ExpenseType.Toll, "amount": Decimal("320"), "date": date.today() - timedelta(days=2), "associated_with": "TR-1001"},
            {"id": "EX-302", "description": "Delhi Highway Parking", "type": ExpenseType.Parking, "amount": Decimal("150"), "date": date.today() - timedelta(days=1), "associated_with": "TR-1002"},
            {"id": "EX-303", "description": "Monthly Office Supplies", "type": ExpenseType.Other, "amount": Decimal("2500"), "date": date.today() - timedelta(days=5)},
        ]
        for e in expenses_data:
            db.add(Expense(**e))
            
        db.commit()
        print("Database seeded successfully with Indian contextual data!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
