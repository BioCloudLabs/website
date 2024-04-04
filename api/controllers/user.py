from flask.views import MethodView
import schemas
import models
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from database import db
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token

blp = Blueprint("users", __name__, description="Users endpoint", url_prefix="/user")

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(schemas.UserLoginSchema)
    def post(self, data):
        user = models.UserModel.query.filter(
            models.UserModel.username == data["username"]
        ).first()

        if user and pbkdf2_sha256.verify(data["password"], user.password):
            access_token = create_access_token(identity=user.id)
            return {"access_token": access_token}, 200

        abort(401, message="Invalid credentials.")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(schemas.UserSchema)

    def post(self, data):
        if models.UserModel.query.filter(models.UserModel.email == data["email"]).first():
            abort(409, message="Username already exists.")

        try:
            user = models.UserModel(
                email=data["email"],
                password=pbkdf2_sha256.hash(data["password"]),
                name=data["name"],
                surname=data["surname"],
                location_id=data["location_id"]
            )

            db.session.add(user)
            db.session.commit()

        except IntegrityError as e:
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "User created successfully."}, 201

@blp.route("/profile")
class UserProfile(MethodView):
    def get(self):
        pass