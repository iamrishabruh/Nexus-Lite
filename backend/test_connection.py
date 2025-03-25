from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_connection():
    response = client.get("/connection")
    assert response.status_code == 200
    assert response.json() == {"message": "Database connected successfully!"}
