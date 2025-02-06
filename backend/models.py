from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class HealthData(Base):
    __tablename__ = "health_data"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, index=True)
    weight = Column(Float)
    bp = Column(String)
    glucose = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
