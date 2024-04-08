import pytest
from flask import Flask
from flask_smorest import Api
import models
import os 
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
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

# Fixture to clean the database of tests users
@pytest.fixture(autouse=True)
def cleanup_db():
    with app.app_context():
        user_to_delete = models.UserModel.query.filter_by(email="test@example.com").first()
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
        "email": "test@example.com",
        "password": "password",
        "name": "Test",
        "surname": "User",
        "location_id": 1
    }

# Create a fixture to get an auth token, used to test
@pytest.fixture
def auth_token(client, payload):
    client.post('/user/register', json=payload)  # Register the test user
    response = client.post('/user/login', json={"email": "test@example.com", "password": "password"})
    return response.json['access_token']

# Test register endpoint when everything it's correct
def test_register_correct(client, payload):
    response = client.post('/user/register', json=payload)
    assert response.status_code == 201

# Test register endpoint when there's alredy an user registered with that email in the database
def test_register_alredy_exists(client, payload):
    client.post('/user/register', json=payload)
    response = client.post('/user/register', json=payload)
    assert response.status_code == 409

# Test register endpoint when there are fields with incorrect format in the POST request
def test_register_failed_wrong_format(client, payload):
    response = client.post('/user/register', json=payload)

    assert response.status_code == 422

# Test register endpoint when there are missing fields in the POST request
def test_register_failed_missing_fields(client):
    payload = {
        "name": "Test",
        "surname": "User"
    }
    response = client.post('/user/register', json=payload)

    assert response.status_code == 422

# Test register endpoint when there are a integrity error  in the POST request. 
# Example: Location ID doesn't exists
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

# Test login endpoint when everything it's correct
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

# Test login endpoint when there are missing fields in the POST request
def test_login_missing_fields(client):

    payload = {
        "email": "test@example.com"
    }

    response = client.post('/user/login', json=payload)
    assert response.status_code == 422

# Test login endpoint when there are no matching email and password on the database
def test_login_user_not_exist(client):

    payload = {
        "email": "test@example.com",
        "password": "test@example.com"
    }

    response = client.post('/user/login', json=payload)
    assert response.status_code == 401

# Test profile endpoint when there are missing fields in the PUT request
def test_profile_failed_missing_fields(client):
    payload = {
        "name": "Test",
        "surname": "User"
    }
    response = client.put('/user/profile', json=payload)

    assert response.status_code == 422

# Test profile endpoint when there are missing fields in the PUT request
def test_profile_failed_missing_token(client):
    payload = {
        "name": "Test",
        "surname": "User",
        "password": "test",
        "location_id": 1
    }
    response = client.put('/user/profile', json=payload)

    assert response.status_code == 401
    assert response.json['msg'] == "Missing Authorization Header"

# Test profile endpoint when there are missing fields in the PUT request
def test_profile_failed_integrity_error(client, auth_token):
    payload = {
        "name": "Test",
        "surname": "User",
        "password": "test",
        "location_id": 1111
    }

    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.put('/user/profile', json=payload, headers=headers)

    assert response.status_code == 400

# Test profile endpoint when the user token in the PUT request it's expired
def test_profile_failed_token_expired(client, expired_token):
    payload = {
        "name": "Test",
        "surname": "User",
        "password": "test",
        "location_id": 1
    }

    headers = {'Authorization': f'Bearer {expired_token}'}
    response = client.put('/user/profile', json=payload, headers=headers)
    print(response.json)
    assert response.status_code == 401
    assert response.json['msg'] == "Token has expired"

# Test profile endpoint when the user token in the PUT has a wrong format
def test_profile_failed_token_wrong_format(client, auth_token):
    payload = {
        "name": "Test",
        "surname": "User",
        "password": "test",
        "location_id": 1
    }

    headers = {'Authorization': f'Bearer {auth_token[2:]}'}
    response = client.put('/user/profile', json=payload, headers=headers)
    print(response.json)
    assert response.status_code == 422
    assert response.json['msg'] == "Invalid header string: 'utf-8' codec can't decode byte 0xc6 in position 2: invalid continuation byte"

# Test profile endpoint when the user token in the PUT request it's invalid
def test_profile_failed_invalid_token(client, auth_token):
    payload = {
        "name": "Test",
        "surname": "User",
        "password": "test",
        "location_id": 1
    }

    headers = {'Authorization': f'Bearer a{auth_token[1:]}'}
    response = client.put('/user/profile', json=payload, headers=headers)
    print(response.json)
    assert response.status_code == 422
    assert response.json['msg'] == "Invalid header string: Expecting value: line 1 column 1 (char 0)"

# Test profile endpoint when everything it's correct
def test_profile_correct(client, auth_token):
    payload = {
        "name": "Test",
        "surname": "User",
        "password": "test",
        "location_id": 1
    }

    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.put('/user/profile', json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json['message'] == "User profile edited successfully."