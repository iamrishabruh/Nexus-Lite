# test_healthdata.py
import pytest
from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_log_health_data():
    # Assume you have an endpoint /healthdata/ that logs health data.
    # Here we simulate a valid health data POST.
    headers = {"Authorization": "Bearer valid_dummy_token"}
    payload = {
        "weight": 160.5,
        "bp": "120/80",
        "glucose": 95.0
    }
    response = client.post("/healthdata/", headers=headers, json=payload)
    assert response.status_code == 200, f"Response: {response.text}"
    data = response.json()
    assert "message" in data and "data_id" in data
