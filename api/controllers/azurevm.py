from flask_jwt_extended import (
    jwt_required, 
    get_jwt_identity
)
from datetime import datetime, timezone, timedelta
from sqlalchemy.exc import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint, abort
import models
import requests
from database import db
import schemas

blp = Blueprint("azurevm", __name__, description="Azure virtual machines endpoint", url_prefix="/api/azurevm")
    
def calc_vm_credits_costs(vm):
    """
    Function that calcs VM cost by the used time.

    :param vm: VM instance
    :return: the total of credits spent by the vm
    """
    # 1€ equals to 100 / 3.99 = 25.06 credits.

    VM_EUROS_MINUTE = 0.001625
    IP_EUROS_MINUTE = 0.00015625
    DISK_EUROS_MINUTE = 0.00755555554

    VM_CREDITS_MINUTE = VM_EUROS_MINUTE * 25.06
    IP_CREDITS_MINUTE = IP_EUROS_MINUTE * 25.06
    DISK_CREDITS_MINUTE = DISK_EUROS_MINUTE * 25.06

    TOTAL_CREDITS_MINUTE = VM_CREDITS_MINUTE + IP_CREDITS_MINUTE + DISK_CREDITS_MINUTE 

    if vm.powered_off_at is None:
        powered_off_time = datetime.now(timezone.utc) + timedelta(hours=2)
    else:
        powered_off_time = vm.powered_off_at.replace(tzinfo=timezone.utc)


    created_at_time = vm.created_at.replace(tzinfo=timezone.utc)

    vm_total_minutes = (powered_off_time - created_at_time).total_seconds() / 60.0
    return round(vm_total_minutes * TOTAL_CREDITS_MINUTE)

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
            vm.powered_off_at = datetime.now()

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
            vm_total_credits = calc_vm_credits_costs(i)
            vm_list.append({"id": i.id, "name": i.name, "created_at": i.created_at, "powered_off_at": i.powered_off_at, "cost": vm_total_credits})

        return {"vm_list": vm_list}, 200
    