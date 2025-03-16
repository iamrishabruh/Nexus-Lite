from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    # One-to-many relationship with HealthData
    health_entries = relationship("HealthData", back_populates="user")

class HealthData(Base):
    __tablename__ = "health_data"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    weight = Column(Float, nullable=True)
    bp = Column(String, nullable=True)
    glucose = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    # Relationship back to user and AI insights
    user = relationship("User", back_populates="health_entries")
    ai_insights = relationship("AIInsight", back_populates="health_data")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(Integer, primary_key=True, index=True)
    health_data_id = Column(Integer, ForeignKey("health_data.id"), nullable=False)
    insight = Column(Text, nullable=True)
    # Relationship back to health data
    health_data = relationship("HealthData", back_populates="ai_insights")
