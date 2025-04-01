# main.py
import uvicorn
import os
from fastapi import FastAPI
from .database import engine
from .models import Base
from .healthdata import router as healthdata_router
from .auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    app = FastAPI(title="Nexus-Lite API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # or specify allowed origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Only create production DB tables if TESTING != "true"
    if os.getenv("TESTING") != "true":
        Base.metadata.create_all(bind=engine)

    @app.get("/connection")
    def find_connection():
        return {"message": "Database connected successfully!"}

    # Register routers
    app.include_router(auth_router)
    app.include_router(healthdata_router)
    # If you also import .ai in main.py, do it here:
    from .ai import router as ai_router
    app.include_router(ai_router)
    # app.include_router(ai_router)

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
