from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth, healthdata, ai

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(healthdata.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Nexus Lite Backend Running"}
