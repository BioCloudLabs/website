from flask.views import MethodView
from flask_smorest import Blueprint, abort
import models
from flask_jwt_extended import jwt_required, get_jwt_identity

blp = Blueprint("stripe", __name__, description="Azure data endpoint", url_prefix="/azuredata")
    
@blp.route("/locations")
class Locations(MethodView):
    def get(self):
        try:
            locations = models.LocationModel.query.all()
            return {"locations": [location.to_dict() for location in locations]}
        except Exception as e:
            abort(500, message=str(e))