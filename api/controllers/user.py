from flask.views import MethodView
import schemas
import models
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from database import db

blp = Blueprint("users", __name__, description="Users endpoint", url_prefix="/user")

@blp.route("/login")
class UserLogin(MethodView):
    def get(self):
        pass

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(schemas.UserSchema)

    def post(self, data):
        if models.UserModel.query.filter(models.UserModel.email == data["email"]).first():
            abort(409, message="Username already exists.")

        user = models.UserModel(
            email=data["email"],
            password=pbkdf2_sha256.hash(data["password"]),
            name=data["name"],
            surname=data["surname"],
            credits=data["credits"],
            location_id=data["location_id"]
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully."}, 201

    def get(self):
        pass









@blp.route("/profile")
class UserProfile(MethodView):
    def get(self):
        pass