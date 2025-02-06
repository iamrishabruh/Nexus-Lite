from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import HealthData

router = APIRouter()

@router.post("/healthdata")
def log_health_data(patient_id: int, weight: float, bp: str, glucose: float, db: Session = Depends(get_db)):
    new_entry = HealthData(patient_id=patient_id, weight=weight, bp=bp, glucose=glucose)
    db.add(new_entry)
    db.commit()
    return {"message": "Health data recorded"}

@router.get("/healthdata/{patient_id}")
def get_health_data(patient_id: int, db: Session = Depends(get_db)):
    data = db.query(HealthData).filter(HealthData.patient_id == patient_id).all()
    return data
