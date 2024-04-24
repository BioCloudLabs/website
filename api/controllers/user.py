from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity, 
    get_jwt
)
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import IntegrityError
from passlib.hash import pbkdf2_sha256
from flask.views import MethodView
from mail_utils import EmailSender
from blocklist import BLOCKLIST
from datetime import timedelta
from bleach import clean
from database import db
import schemas
import models
import os

email_sender = EmailSender(os.getenv("EMAIL_API_KEY"))

blp = Blueprint("users", __name__, description="Users endpoint", url_prefix="/user")

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(schemas.UserSchema(only=("email", "password",)))
    def post(self, data):
        """
        API Endpoint to log in an user.

        :param data: User login data.
        :return: HTTP response with the login result. If login it's correct, return an access_token.
        """

        user = models.UserModel.query.filter(models.UserModel.email == clean(data["email"])).first()

        if user and pbkdf2_sha256.verify(clean(data["password"]), user.password):
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=6))
            return {"access_token": access_token}, 200

        abort(401, message="Invalid credentials.")

@blp.route("/validate-token")
class UserValidateToken(MethodView):  
    @jwt_required()
    def post(self):
        """
        API Endpoint to validate a token.

        :return: HTTP response with the validation result.
        """

        return {"message": "Token is valid."}, 200

@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        """
        API Endpoint to log out an user.

        :return: HTTP response with the logout result.
        """
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 200

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(schemas.UserSchema(only=("email", "password", "name", "surname", "location_id",)))

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
        """
        API Endpoint to get an user profile.

        :return: HTTP response with the user profile.
        """

        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        return {"email": user.email, "name": user.name, "surname": user.surname, 
                    "location_id": user.location_id, "credits": user.credits}, 200
    

    @jwt_required()
    @blp.arguments(schemas.UserSchema(only=("name", "surname", "location_id",)))
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
            user.name=clean(payload["name"]),
            user.surname=clean(payload["surname"]),
            user.location_id=payload["location_id"]

            db.session.commit()

        except IntegrityError as e:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred. {str(e)}")

        return {"message": "User profile edited successfully."}, 201
    
@blp.route("/credits")
class UserCredits(MethodView):
    @jwt_required()
    def get(self):
        """
        API Endpoint to get an user credits.

        :return: HTTP response with the user credits.
        """

        user_id = get_jwt_identity() # Get the user id from the jwt

        user = db.session.get(models.UserModel, user_id)

        if user is None:
            abort(404, message="User not found")
        
        return {"credits": user.credits}, 200
    
@blp.route("/change-password")
class UserPassword(MethodView):

    @jwt_required()
    @blp.arguments(schemas.UserPasswordSchema)
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

        if not pbkdf2_sha256.verify(clean(payload["old_password"]), user.password):
            abort(401, message="Invalid credentials.")

        if pbkdf2_sha256.verify(clean(payload["new_password"]), user.password):
            abort(409, message="New password is the same as the old one.")

        try:
            user.password=pbkdf2_sha256.hash(clean(payload["new_password"]))

            db.session.commit()

        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "User password changed successfully."}, 201
    
@blp.route("/recover-password-email")
class UserRecoverPasswordEmail(MethodView):

    @blp.arguments(schemas.UserSchema(only=("email",)))
    def post(self, payload):
        """
        API Endpoint to send an email to recover a password to an user.

        :param payload: User data from the json.
        :return: HTTP response with the result.
        """

        user = models.UserModel.query.filter_by(email=payload["email"]).one_or_404("User not found")
        
        email_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=15)) 

        try:
            email_sender.recover_password(f"{os.getenv('DOMAIN')}/recoverpassword?token={email_token}", user.email, f"{user.name} {user.surname}")
        except Exception as e:
            return {"message": f"An error has ocurred while sending the email. {str(e)}"}, 500

        return {"message": f"Email has sent to the email {user.email}", "email": user.email}, 201
    
@blp.route("/recover-password")
class UserRecoverPassword(MethodView):

    @jwt_required()
    @blp.arguments(schemas.UserSchema(only=("password",)))
    def post(self, payload):
        """
        API Endpoint to recover a password to an user.

        :param payload: User data from the json.
        :return: HTTP response with the result.
        """

        user_id = get_jwt_identity() # Get the user id from the jwt

        user = db.session.get(models.UserModel, user_id)
            
        if user is None:
            abort(404, message="User not found")

        if pbkdf2_sha256.verify(clean(payload["password"]), user.password):
            abort(409, message="New password is the same as the old one.")

        try:
            user.password=pbkdf2_sha256.hash(clean(payload["password"]))

            db.session.commit()

        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "User password changed successfully."}, 201