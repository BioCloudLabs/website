from flask_jwt_extended import (
    jwt_required, 
    get_jwt_identity
)
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint, abort
import models
import requests
from database import db
import schemas

blp = Blueprint("azurevm", __name__, description="Azure virtual machines endpoint", url_prefix="/api/azurevm")
    
@blp.route("/setup")
class SetupVirtualMachine(MethodView):


    @jwt_required()
    def get(self):
        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        if user.credits <= 0:
            abort(401, message="Not enough credits.")

        res = requests.get("http://localhost:4000/vm/setup")
        json_res = res.json()

        if "code" in json_res:
            if json_res["code"] == 500:
                abort(500, message="Error trying to create a VM, please try again.")

        dns = json_res["dns"]
        ip = json_res["ip"]

        try:
            vm = models.VirtualMachineModel(
                type="Standard_B2s",
                name=dns,
                user_id=user.id
            )

            db.session.add(vm)
            db.session.commit()

        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"ip": ip, "dns": dns}, 200

        
@blp.route("/poweroff")
class PowerOffMachine(MethodView):

    @jwt_required()
    @blp.arguments(schemas.VmSchema)
    def delete(self, payload):
        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        vm = models.VirtualMachineModel.query.filter_by(id=payload["id"]).one_or_404(description="VM not found")

        vm_name = vm.name.split('.')[0]

        res = requests.get(f"http://localhost:4000/vm/poweroff/{vm_name}")
        json_res = res.json()

        if "code" in json_res:
            if json_res["code"] == 500:
                abort(500, message="Error trying to power off a VM, please try again.")

        try:
            vm.poweredof_at = datetime.now()

            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "VM Removed"}, 200
    

@blp.route("/history")
class VirtualMachinesHistory(MethodView):

    @jwt_required()
    def get(self):
        user_by_jwt = get_jwt_identity()

        user = db.session.get(models.UserModel, user_by_jwt)

        if user is None:
            abort(404, message="User not found")

        vms = models.VirtualMachineModel.query.filter_by(user_id=user_by_jwt).all()

        vm_list = []

        if not vms:
            abort(404, message="No VMs found.") 


        for i in vms:
            vm_list.append({"id": i.id, "name": i.name, "created_at": i.created_at, "powered_off_at": i.powered_off_at})

        return {"vm_list": vm_list}, 200