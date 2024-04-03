from flask_smorest import Blueprint
from flask.views import MethodView

blp = Blueprint("users", __name__, description="Users endpoint", url_prefix="/user")

@blp.route("/login")
class UserLogin(MethodView):
    def get(self):
        pass

@blp.route("/register")
class UserRegister(MethodView):
    def get(self):
        pass

@blp.route("/profile")
class UserProfile(MethodView):
    def get(self):
        pass