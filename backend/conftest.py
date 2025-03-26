import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool  # force the same connection to be reused

from .models import Base, User
from .database import get_db
from .main import app
from .healthdata import get_current_user  # import the function you're overriding

TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """Creates a fresh session for each test."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture(autouse=True)
def override_db(db_session):
    """Overrides get_db so that FastAPI uses our in-memory DB for each test."""
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = _override_get_db
    yield
    #app.dependency_overrides.clear()


def override_get_current_user(authorization: str = None, db=None) -> User:
    return User(id=1, email="test@example.com", password="hashed", first_name="Test", last_name="User")

app.dependency_overrides[get_current_user] = override_get_current_user
