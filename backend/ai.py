#from dotenv import load_dotenv
import os
from openai import OpenAI
#load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import logging
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .database import get_db
from .models import HealthData, User
from .utils import decode_access_token

router = APIRouter(prefix="/ai", tags=["ai"])

logging.basicConfig(level=logging.INFO)

class AIRequest(BaseModel):
    # Extend this model if you want to add extra parameters later
    pass

def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = parts[1]
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
    entries = db.query(HealthData).filter(HealthData.patient_id == current_user.id).all()
    if not entries:
        return {"insights": "No health data found to generate insights."}

    # Prepare a detailed list of health entries including timestamp
    formatted_entries = []
    for entry in entries:
        # Ensure entry.timestamp exists and convert it to a readable format
        timestamp_str = entry.timestamp.strftime("%Y-%m-%d %H:%M:%S") if entry.timestamp else "N/A"
        formatted_entries.append({
            "timestamp": timestamp_str,
            "weight": entry.weight,
            "blood_pressure": entry.bp,
            "glucose": entry.glucose,
        })

    # Build a prompt with clear instructions and structured formatting
    prompt = (
    "You are a helpful medical assistant. Below is an aggregated list of health data entries for a user, "
    "each with a timestamp and corresponding measurements. Please analyze the overall progression of the user's health data, "
    "identifying trends and any significant deviations (e.g., if values are consistently too high or too low). "
    "Provide personalized recommendations based on the overall trend and progression, addressing weight (in lbs), blood pressure (in mmHg), and glucose (in mg/dL). "
    "Return your analysis and recommendations as one well-structured paragraph (2-3 sentences) without listing each individual data point.\n\n"
    "Health Data Entries:\n\n"
    )

    for entry in formatted_entries:
        prompt += (
            f"Timestamp: {entry['timestamp']}\n"
            f"- Weight (lbs): {entry['weight']}\n"
            f"- Blood Pressure (mmHg): {entry['blood_pressure']}\n"
            f"- Glucose (mg/dL): {entry['glucose']}\n\n"
        )
    prompt += "Please provide one hollistic recommendation with each entry in mind, aggregated and reasoned as specified."

    logging.info("Sending prompt to OpenAI:\n%s", prompt)

    try:
        response = client.chat.completions.create(model="gpt-4",  # Use "gpt-3.5-turbo" if GPT-4 is unavailable
        messages=[
            {
                "role": "system",
                "content": "You are a helpful medical assistant who provides personalized health advice in a structured format."
            },
            {"role": "user", "content": prompt}
        ],
        max_tokens=250,
        temperature=0.7)
        ai_content = response.choices[0].message.content.strip()
        return {"insights": ai_content}
    except Exception as e:
        logging.error("OpenAI API error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
