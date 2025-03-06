# backend/models.py

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # Relationship to health data
    health_entries = relationship("HealthData", back_populates="user") #One to optional many relationship

class HealthData(Base):
    __tablename__ = "health_data"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False) #references user.id from User table
    weight = Column(Float, nullable=True) #health metrics are nullable since a user can have 0 to many health metrics
    bp = Column(String, nullable=True)  # blood pressure
    glucose = Column(Float, nullable=True)
    #Relationship to user
    user = relationship("User", back_populates="health_entries") 

class AIInsight(Base):
    _tablename_ = "ai_insights" 
    id = Column(Integer, primary_key=True, index=True) 
    health_data_id = patient_id = Column(Integer, ForeignKey("health_data.id"), nullable=False) #connects insight to healthdata
    insight = Column(Text, nullable=True)
    health_entries = relationship("HealthData", back_populates="ai_insights")

