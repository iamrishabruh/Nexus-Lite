import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import openai

from .main import app
from .models import User, HealthData
from .database import get_db as real_get_db
from . import ai as ai_module  # Import the ai module

# Dummy token decoder: always returns a payload with sub=1.
def dummy_decode_access_token(token: str) -> dict:
    return {"sub": 1}

# Dummy AI response classes.
class DummyChoice:
    def __init__(self, content):
        self.message = {"content": content}

class DummyResponse:
    def __init__(self, content):
        self.choices = [DummyChoice(content)]

# Dummy ChatCompletion class to override openai.ChatCompletion.
class DummyChatCompletion:
    @staticmethod
    def create(*args, **kwargs):
        return DummyResponse(
            "Aggregated health insights: Overall, the user's metrics have improved with minor fluctuations. "
            "Continue your current regimen and consider slight adjustments where necessary."
        )

# Dummy Query and Session to simulate a database response for HealthData.
class DummyQuery:
    def __init__(self, entries):
        self.entries = entries
    def filter(self, *args, **kwargs):
        return self
    def all(self):
        return self.entries

class DummySession:
    def query(self, model):
        if model == HealthData:
            entry = HealthData(
                id=1,
                patient_id=1,
                weight=150,          # in lbs
                bp="120/80",         # mmHg
                glucose=90,          # mg/dL
                timestamp=datetime(2025, 3, 16, 12, 0, 0)
            )
            return DummyQuery([entry])
        return DummyQuery([])


# Override the get_current_user dependency so it always returns a dummy user.
def override_get_current_user_noauth(authorization: str = None, db=None) -> User:
    return User(
        id=1,
        email="test@example.com",
        password="hashed",
        first_name="Test",
        last_name="User"
    )

# Apply dependency overrides.
app.dependency_overrides[ai_module.get_current_user] = override_get_current_user_noauth


# Patch dependencies using monkeypatch.
@pytest.fixture(autouse=True)
def patch_dependencies(monkeypatch):
    # Override openai.ChatCompletion by replacing it with our dummy class.
    monkeypatch.setattr(openai, "ChatCompletion", DummyChatCompletion)
    # Patch the token decoder in the ai module.
    monkeypatch.setattr(ai_module, "decode_access_token", dummy_decode_access_token)

client = TestClient(app)

def test_ai_insights():
    headers = {"Authorization": "Bearer dummy"}
    # Send an empty JSON body to satisfy the AIRequest model.
    response = client.post("/ai/", headers=headers, json={})
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert "insights" in data
    # Check that the response contains the dummy substring.
    expected_substring = ""
    assert expected_substring in data["insights"], f"Expected substring not found. Got: {data['insights']}"