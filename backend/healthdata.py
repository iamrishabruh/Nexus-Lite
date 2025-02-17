# backend/healthdata.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from .database import get_db
from .models import HealthData, User
from .utils import decode_access_token

router = APIRouter(prefix="/healthdata", tags=["healthdata"])

class HealthDataRequest(BaseModel):
    weight: float
    bp: str
    glucose: float

class HealthDataResponse(BaseModel):
    id: int
    weight: float
    bp: str
    glucose: float

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

@router.post("/", response_model=dict)
def log_health_data(
    data: HealthDataRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_entry = HealthData(
        patient_id=current_user.id,
        weight=data.weight,
        bp=data.bp,
        glucose=data.glucose
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return {"message": "Health data recorded", "data_id": new_entry.id}

@router.get("/", response_model=List[HealthDataResponse])
def get_health_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = db.query(HealthData).filter(HealthData.patient_id == current_user.id).all()
    return entries
