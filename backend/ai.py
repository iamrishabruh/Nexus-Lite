# backend/ai.py

import os
import openai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .database import get_db
from .models import HealthData, User
from .utils import decode_access_token

router = APIRouter(prefix="/ai", tags=["ai"])

openai.api_key = os.getenv("OPENAI_API_KEY")

class AIRequest(BaseModel):
    # Optionally, you can pass specific health data or a timeframe
    pass

def get_current_user(token: str = Depends(lambda: None), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@router.post("/")
def get_health_insights(
    request: AIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve the user's recent health data
    entries = db.query(HealthData).filter(HealthData.patient_id == current_user.id).all()
    if not entries:
        return {"insights": "No health data found to generate insights."}

    # Format the data for AI
    formatted_data = []
    for entry in entries:
        formatted_data.append(
            {
                "weight": entry.weight,
                "bp": entry.bp,
                "glucose": entry.glucose
            }
        )

    # Make an OpenAI API call
    try:
        prompt = f"Provide personalized health recommendations based on the following data:\n{formatted_data}"
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        ai_content = response.choices[0].message["content"].strip()
        return {"insights": ai_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
