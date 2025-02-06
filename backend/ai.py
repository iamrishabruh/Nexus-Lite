from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import HealthData
import openai

router = APIRouter()

openai.api_key = "your-openai-api-key"  # Replace with your actual OpenAI API key

def get_health_insight(data):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": f"Patient data: {data}"}]
    )
    return response["choices"][0]["message"]["content"]

@router.get("/ai/insights/{patient_id}")
def generate_ai_insights(patient_id: int, db: Session = Depends(get_db)):
    data = db.query(HealthData).filter(HealthData.patient_id == patient_id).order_by(HealthData.timestamp.desc()).first()
    if not data:
        return {"message": "No health data available for AI insights"}
    
    insight = get_health_insight(f"Weight: {data.weight}, BP: {data.bp}, Glucose: {data.glucose}")
    return {"ai_insight": insight}
