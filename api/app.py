from flask import Flask, jsonify
from flask_smorest import Api
import models
import base64
import os 
from flask_jwt_extended import JWTManager
from database import db
from flask_migrate import Migrate
from datetime import datetime
from controllers.user import blp as UserBlueprint
from dotenv import load_dotenv



app: Flask = Flask(__name__)

load_dotenv()

app.config["API_TITLE"] = os.getenv("API_TITLE")
app.config["API_VERSION"] = os.getenv("API_VERSION")
app.config["OPENAPI_VERSION"] = os.getenv("OPENAPI_VERSION")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

db.init_app(app)

Migrate(app, db)

api: Api = Api(app)

api.register_blueprint(UserBlueprint)

# with app.app_context():
#     new_user = models.UserModel(
#         email='ejemplo@example.com',
#         password='contraseña',
#         name='Nombre',
#         surname='Apellido',
#         created_at=datetime.now(),
#         role_id=1,
#         credits='0',
#         location_id=1
#     )

#     new_location = models.LocationModel(
#         name="España"
#     )

#     new_location2 = models.LocationModel(
#         name="Portugal"
#     )

#     db.session.add(new_user)
#     db.session.add(new_location)
#     db.session.add(new_location2)

#     db.session.commit()
