# backend/main.py

import uvicorn
from fastapi import FastAPI
from .database import engine, get_db
from .models import Base
from .auth import router as auth_router
from .healthdata import router as healthdata_router
from .ai import router as ai_router

def create_app() -> FastAPI:
    app = FastAPI(title="Nexus-Lite API", version="1.0.0")

    # Create the database tables
    Base.metadata.create_all(bind=engine)
    # Dependency to get a db session
    get_db()
    @app.get("/connection")
    def find_connection():
        return {"message": "Database connected successfully!"}
    # Register routers
    app.include_router(auth_router)
    app.include_router(healthdata_router)
    app.include_router(ai_router)

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
