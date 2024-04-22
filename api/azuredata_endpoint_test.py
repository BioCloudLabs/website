import pytest
from flask import Flask
from flask_smorest import Api
import models
import os 
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
from database import db
from flask_migrate import Migrate
from controllers.azuredata import blp as AzuredataBlueprint
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

api.register_blueprint(AzuredataBlueprint)

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Test locations endpoint when everything it's correct
def test_locations_correct(client):
    response = client.get('/azuredata/locations')
    assert response.status_code == 200
    assert 'locations' in response.json
