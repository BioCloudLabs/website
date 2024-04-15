from flask.views import MethodView
from bleach import clean
import schemas
import models
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from database import db
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

blp = Blueprint("users", __name__, description="Users endpoint", url_prefix="/user")

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(schemas.UserLoginSchema)
    def post(self, data):
        """
        API Endpoint to log in an user.

        :param data: User login data.
        :return: HTTP response with the login result. If login it's correct, return an access_token.
        """

        user = models.UserModel.query.filter(models.UserModel.email == clean(data["email"])).first()

        if user and pbkdf2_sha256.verify(clean(data["password"]), user.password):
            access_token = create_access_token(identity=user.id)
            return {"access_token": access_token}, 200

        abort(401, message="Invalid credentials.")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(schemas.UserRegisterSchema)

    def post(self, payload):
        """
        API Endpoint to register a new user.

        :param payload: User data from the json to register.
        :return: HTTP response with the registration result.
        """
        
        if models.UserModel.query.filter(models.UserModel.email == payload["email"]).first():
            abort(409, message="User with that email already exists.")

        try:
            user = models.UserModel(
                email=clean(payload["email"]),
                password=pbkdf2_sha256.hash(clean(payload["password"])),
                name=clean(payload["name"]),
                surname=clean(payload["surname"]),
                location_id=payload["location_id"]
            )

            db.session.add(user)
            db.session.commit()

        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "User created successfully."}, 201

@blp.route("/profile")
class UserProfile(MethodView):
    @jwt_required()
    def get(self):

        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        return {"email": user.email, "name": user.name, "surname": user.surname, 
                    "location_id": user.location_id, "credits": user.credits}, 200
    

    @jwt_required()
    @blp.arguments(schemas.UserProfileSchema)
    def put(self, payload):
        """
        API Endpoint to edit an existing user profile.

        :param payload: User data from the json to register.
        :return: HTTP response with the registration result.
        """
        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        try:
            user.password=pbkdf2_sha256.hash(clean(payload["password"])),
            user.name=clean(payload["name"]),
            user.surname=clean(payload["surname"]),
            user.location_id=payload["location_id"]

            db.session.commit()

        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "User profile edited successfully."}, 201