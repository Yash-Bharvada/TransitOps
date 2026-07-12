# 📖 TransitOps API Documentation

The TransitOps backend is powered by FastAPI, providing a fully featured RESTful API for fleet management. 

**Base URL:** `http://localhost:8000/api/v1` (or relative path depending on router prefix, currently endpoints might be directly on root or `/api`)
*Note: In the current setup, standard routes might be at `http://localhost:8000/` or specific prefixes.*

## 🔐 Authentication (`/auth`)

All secured endpoints require a JWT Bearer token in the `Authorization` header:
`Authorization: Bearer <token>`

- `POST /auth/register`
  - Registers a new user.
  - **Body:** `{ "email": "...", "password": "...", "full_name": "...", "role": "admin|manager|driver|viewer" }`
- `POST /auth/login`
  - Authenticates a user and returns a JWT token.
  - **Body:** `{ "email": "...", "password": "..." }`

---

## 🚛 Vehicles (`/vehicles`)

- `GET /vehicles/` - List all vehicles.
- `GET /vehicles/{id}` - Get vehicle by ID.
- `POST /vehicles/` - Add a new vehicle *(Requires Admin/Manager)*.
  - **Body:** `{ "id": "...", "make": "...", "model": "...", "year": 2024, "status": "Available" }`
- `PATCH /vehicles/{id}` - Update a vehicle *(Requires Admin/Manager/Driver)*.
- `DELETE /vehicles/{id}` - Delete a vehicle *(Requires Admin/Manager/Driver)*.

---

## 👥 Drivers (`/drivers`)

- `GET /drivers/` - List all drivers.
- `GET /drivers/{id}` - Get driver by ID.
- `POST /drivers/` - Add a new driver.
- `PATCH /drivers/{id}` - Update driver details (e.g., deducting `safety_score` for incidents).
- `DELETE /drivers/{id}` - Delete a driver.

---

## 🗺️ Trips (`/trips`)

- `GET /trips/` - List all trips.
- `POST /trips/` - Dispatch a new trip.
  - **Body:** `{ "vehicle_id": "...", "driver_id": "...", "start_location": "...", "end_location": "...", "status": "Pending" }`
- `PATCH /trips/{id}` - Update trip status (e.g., to `Completed`).
- `DELETE /trips/{id}` - Delete a trip record.

---

## 🔧 Maintenance (`/maintenance`)

- `GET /maintenance/` - List all maintenance records.
- `POST /maintenance/` - Schedule maintenance.
  - **Body:** `{ "vehicle_id": "...", "description": "...", "cost": 0, "status": "Scheduled" }`
- `PATCH /maintenance/{id}` - Update maintenance status (e.g., to `Completed`).
- `DELETE /maintenance/{id}` - Delete a maintenance log.

---

## ⛽ Expenses (`/expenses`)

- `GET /expenses/` - List all expense records.
- `POST /expenses/` - Log a new expense (e.g., Fuel, Tolls).
  - **Body:** `{ "vehicle_id": "...", "expense_type": "Fuel", "amount": 150.00, "date": "..." }`
- `PATCH /expenses/{id}` - Update an expense record.
- `DELETE /expenses/{id}` - Delete an expense record.

---

## 📊 Dashboard & Reports (`/reports`)

- `GET /reports/dashboard` - Get aggregated metrics for the dashboard (total vehicles, active trips, pending maintenance, total expenses).

---

> **Tip:** FastAPI automatically generates interactive documentation. Run the backend and visit `http://localhost:8000/docs` to test these endpoints directly via Swagger UI.
