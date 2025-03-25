# test_auth.py
import pytest
from fastapi.testclient import TestClient

# Use a relative import to match main.py's location
from .main import app

client = TestClient(app)

def test_register_new_user():
    response = client.post(
        "/auth/register", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "pass123", 
            "firstName": "Ley", 
            "lastName": "Eheri"
        }
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully"}

def test_register_existing_user():
    # First registration
    client.post(
        "/auth/register", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "pass123", 
            "firstName": "Ley", 
            "lastName": "Eheri"
        }
    )
    # Second registration attempt with same email
    response = client.post(
        "/auth/register", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "pass123", 
            "firstName": "Ley", 
            "lastName": "Eheri"
        }
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}

def test_login_incorrect_email():
    response = client.post(
        "/auth/login", 
        json={
            "email": "jerry5831@bankrau.com", 
            "password": "pass123"
        }
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password"}

def test_login_incorrect_password():
    # Register user first
    client.post(
        "/auth/register", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "pass123", 
            "firstName": "Ley", 
            "lastName": "Eheri"
        }
    )
    # Login with wrong password
    response = client.post(
        "/auth/login", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "user123"
        }
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password"}

def test_login_after_register():
    # Register
    client.post(
        "/auth/register", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "pass123", 
            "firstName": "Ley", 
            "lastName": "Eheri"
        }
    )
    # Login
    response = client.post(
        "/auth/login", 
        json={
            "email": "leheri5831@bankrau.com", 
            "password": "pass123"
        }
    )
    assert response.status_code == 200
