from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set all CORS enabled origins
    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    @app.get("/health")
    def health_check():
        return {"status": "ok"}

    from app.routers import api_router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app

app = create_app()
