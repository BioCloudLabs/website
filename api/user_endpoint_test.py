import pytest
from flask import Flask
from flask_smorest import Api
import models
import os 
from flask_jwt_extended import JWTManager
from database import db
from flask_migrate import Migrate
from controllers.user import blp as UserBlueprint
from dotenv import load_dotenv

app: Flask = Flask(__name__)

load_dotenv()

app.config["API_TITLE"] = os.getenv("API_TITLE")
app.config["API_VERSION"] = os.getenv("API_VERSION")
app.config["OPENAPI_VERSION"] = os.getenv("OPENAPI_VERSION")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("TEST_SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

db.init_app(app)

Migrate(app, db)

api: Api = Api(app)

jwt = JWTManager(app)

api.register_blueprint(UserBlueprint)

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@pytest.fixture(autouse=True)
def cleanup_db():
    with app.app_context():
        db.session.query(models.UserModel).delete()
        db.session.commit()

def test_register_correct(client):
    payload = {
        "email": "test@example.com",
        "password": "password123",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }
    response = client.post('/user/register', json=payload)
    assert response.status_code == 201

def test_register_alredy_exists(client):
    payload = {
        "email": "test@example.com",
        "password": "password123",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }
    response = client.post('/user/register', json=payload)
    payload = {
        "email": "test@example.com",
        "password": "password123",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }
    response = client.post('/user/register', json=payload)
    assert response.status_code == 409

def test_register_failed_wrong_format(client):
    payload = {
        "email": "test@example",
        "password": "password123",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }
    response = client.post('/user/register', json=payload)

    assert response.status_code == 422

def test_register_failed_missing_fields(client):
    payload = {
        "name": "Test",
        "surname": "User"
    }
    response = client.post('/user/register', json=payload)

    assert response.status_code == 422

def test_register_integrity_error(client):
    payload = {
        "email": "testtttt@example.com",
        "password": "password123",
        "name": "Test",
        "surname": "User",
        "location_id": 1111
    }
    response = client.post('/user/register', json=payload)

    assert response.status_code == 400



def test_login_correct(client):
    payload = {
        "email": "test@example.com",
        "password": "password123",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }
    client.post('/user/register', json=payload)

    payload = {
        "email": "test@example.com",
        "password": "password123"
    }

    response = client.post('/user/login', json=payload)
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_login_missing_fields(client):

    payload = {
        "email": "test@example.com"
    }

    response = client.post('/user/login', json=payload)
    assert response.status_code == 422

def test_login_user_not_exist(client):

    payload = {
        "email": "test@example.com",
        "password": "test@example.com"
    }

    response = client.post('/user/login', json=payload)
    assert response.status_code == 401