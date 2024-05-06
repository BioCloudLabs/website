from flask_jwt_extended import (
    jwt_required, 
    get_jwt_identity
)
from sqlalchemy.exc import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint, abort
import models
import requests
from database import db

blp = Blueprint("azurevm", __name__, description="Azure virtual machines endpoint", url_prefix="/azurevm")
    
@blp.route("/setup")
class SetupVirtualMachine(MethodView):


    @jwt_required()
    def get(self):
        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        res = requests.get("http://localhost:4000/vm/setup")
        json_res = res.json()
        print(json_res)

        if "code" in json_res:
            if json_res["code"] == 500:
                abort(500, message="Error trying to create a VM, please try again.")

        dns = json_res["dns"]
        ip = json_res["ip"]

        try:
            vm = models.VirtualMachineModel(
                type="Standard_B2s",
                name=dns,
                ip=ip,
                user_id=user.id
            )

            db.session.add(vm)
            db.session.commit()

        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"ip": ip, "dns": dns}, 200