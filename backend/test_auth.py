import pytest
import os
os.environ["TESTING"] = "true"
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from backend.main import app
from backend.models import Base
from backend.database import get_db
from fastapi.testclient import TestClient


load_dotenv()

DATABASE_URL = os.getenv("DB_URL", "sqlite:///./test_nexus_lite.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture()
def testing_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)
def test_register_new_user(testing_db):
    response = client.post("/auth/register", json={"email": "leheri5831@bankrau.com", "password": "pass123", "firstName": "Ley", "lastName": "Eheri"})
    assert response.status_code == 200 # this code means the response is correct and works
    assert response.json() == {"message": "User registered successfully"}
def test_register_existing_user(testing_db):
    client.post("/auth/register", json={"email": "leheri5831@bankrau.com", "password": "pass123", "firstName": "Ley", "lastName": "Eheri"})
    response = client.post("/auth/register", json={"email": "leheri5831@bankrau.com", "password": "pass123", "firstName": "Ley", "lastName": "Eheri"})
    assert response.status_code == 400 # the first registration is successful, and the second registration fails as it's an existing user
    assert response.json() == {"detail": "Email already registered"}
def test_login_incorrect_email(testing_db):
    response = client.post("/auth/login", json={"email": "jerry5831@bankrau.com", "password": "pass123"})
    assert response.status_code == 401 
    assert response.json() == {"detail": "Invalid email or password"}
def test_login_incorrect_password(testing_db):
    response = client.post("/auth/login", json={"email": "leheri5831@bankrau.com", "password": "user123"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password"}
def test_login_after_register(testing_db):
    client.post("/auth/register", json={"email": "leheri5831@bankrau.com", "password": "pass123", "firstName": "Ley", "lastName": "Eheri"})
    response = client.post("/auth/login", json={"email": "leheri5831@bankrau.com", "password": "pass123"})
    assert response.status_code == 200 # the email and password work and the user logs in.
