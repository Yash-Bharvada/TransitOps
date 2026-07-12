# TransitOps Backend

This is the complete, production-ready FastAPI backend for the TransitOps fleet management system.

## Setup Instructions

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - Linux/Mac: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and set up your PostgreSQL credentials.
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations:
   ```bash
   alembic upgrade head
   ```
6. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Testing

Run tests with Pytest:
```bash
pytest
```

## API Documentation
Once the server is running, you can access the Swagger UI documentation at:
http://localhost:8000/docs
