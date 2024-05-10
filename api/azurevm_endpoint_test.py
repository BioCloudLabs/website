import pytest
from flask import Flask
from flask_smorest import Api
import models
import os 
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
from database import db
from flask_migrate import Migrate
from controllers.azurevm import blp as AzureVmBlueprint
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
api.register_blueprint(AzureVmBlueprint)

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Fixture to clean the database of tests users
@pytest.fixture(autouse=True)
def cleanup_db():
    with app.app_context():
        user_to_delete = models.UserModel.query.filter_by(email="test2@example.com").first()
        if user_to_delete:
            db.session.delete(user_to_delete)
            db.session.commit()

# Fixture to create an expired token, used to test
@pytest.fixture
def expired_token():
    with app.app_context():
        expiration_delta = timedelta(seconds=-1)
        expired_token = create_access_token(identity=184, expires_delta=expiration_delta)
        return expired_token

# Fixture to get a payload
@pytest.fixture
def payload():
    return {
        "email": "test2@example.com",
        "password": "Password123!",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }

# Create a fixture to get an auth token, used to test
@pytest.fixture
def auth_token(client, payload):
    client.post('/api/user/register', json=payload)  # Register the test user
    response = client.post('/api/user/login', json={"email": "test@example.com", "password": "Password123!"})
    return response.json['access_token']

# Test azurevm setup endpoint when user credits = 0
def test_azurevm_history_has_machines_correct(client, auth_token):
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.get('/api/azurevm/setup', headers=headers)
    assert response.status_code == 401
    assert response.json['message'] == "Not enough credits."

# Test azurevm history endpoint when everything it's correct 
# and user has vms
def test_azurevm_history_has_machines_correct(client, auth_token):
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.get('/api/azurevm/history', headers=headers)
    assert response.status_code == 200
    assert 'vm_list' in response.json

# Test azurevm history endpoint when everything it's correct 
# but the user doesn't have vms
def test_azurevm_history_no_machines_correct(client, payload):
    client.post("/api/user/register", json=payload)
    response = client.post("/api/user/login", json={"email": "test2@example.com", "password": "Password123!"})

    headers = {'Authorization': f'Bearer {response.json["access_token"]}'}
    response = client.get('/api/azurevm/history', headers=headers)
    assert response.status_code == 404
    assert response.json["message"] == "No VMs found."

# Test azurevm history endpoint when no token in the GET
def test_azurevm_history_no_token(client):
    response = client.get('/api/azurevm/history')
    assert response.status_code == 401

# Test azurevm history endpoint when the user token in the request it's expired
def test_azurevm_history_token_expired(client, expired_token):
    headers = {'Authorization': f'Bearer {expired_token}'}
    response = client.get('/api/azurevm/history', headers=headers)
    assert response.status_code == 401
    assert response.json['msg'] == "Token has expired"