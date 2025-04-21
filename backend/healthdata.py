from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, validator
from database import get_db
from datetime import datetime
from models import HealthData, User
from utils import decode_access_token
import re

router = APIRouter(prefix="/healthdata", tags=["healthdata"])

class HealthDataRequest(BaseModel):
    weight: float
    bp: str
    glucose: float

    @validator('weight')
    def validate_weight(cls, v):
        if v <= 0:
            raise ValueError('Weight must be a positive number')
        return round(v, 2)

    @validator('glucose')
    def validate_glucose(cls, v):
        if v <= 0:
            raise ValueError('Glucose level must be a positive number')
        return round(v, 2)

    @validator('bp')
    def validate_blood_pressure(cls, v):
        v = v.replace(' ', '')
        if not re.match(r'^\d{2,3}/\d{2,3}$', v):
            raise ValueError('Blood pressure must be in format "systolic/diastolic" (e.g., 120/80)')
        systolic, diastolic = map(int, v.split('/'))
        if systolic < 70 or systolic > 250:
            raise ValueError('Systolic pressure must be between 70 and 250')
        if diastolic < 40 or diastolic > 150:
            raise ValueError('Diastolic pressure must be between 40 and 150')
        return v

class HealthDataResponse(BaseModel):
    id: int
    weight: float
    bp: str
    glucose: float
    timestamp: datetime

    class Config:
        orm_mode = True

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
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
    entries = db.query(HealthData).filter(HealthData.patient_id == current_user.id).order_by(HealthData.timestamp.desc()).all()
    return entries

@router.delete("/{entry_id}", response_model=dict)
def delete_health_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("🗑️ DELETE: current_user.id =", current_user.id)  # 👈 Add this line

    entry = db.query(HealthData).filter(
        HealthData.id == entry_id,
        HealthData.patient_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted successfully"}

@router.put("/{entry_id}", response_model=HealthDataResponse)
def update_health_entry(
    entry_id: int,
    data: HealthDataRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("⚠️ UPDATE: current_user.id =", current_user.id)  # 👈 Add this line

    entry = db.query(HealthData).filter(
        HealthData.id == entry_id,
        HealthData.patient_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry.weight = data.weight
    entry.bp = data.bp
    entry.glucose = data.glucose
    db.commit()
    db.refresh(entry)
    return entry