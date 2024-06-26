from flask_jwt_extended import (
    jwt_required, 
    get_jwt_identity
)
from mail_utils import EmailSender
from datetime import datetime, timezone, timedelta
from sqlalchemy.exc import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint, abort
import models
import requests
from database import db
import schemas
import os

email_sender = EmailSender(os.getenv("EMAIL_API_KEY"))

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
    DISK_EUROS_MINUTE = 0.00012592592 

    VM_CREDITS_MINUTE = VM_EUROS_MINUTE * 25.06
    IP_CREDITS_MINUTE = IP_EUROS_MINUTE * 25.06
    DISK_CREDITS_MINUTE = DISK_EUROS_MINUTE * 25.06

    TOTAL_CREDITS_MINUTE = VM_CREDITS_MINUTE + IP_CREDITS_MINUTE + DISK_CREDITS_MINUTE

    if vm.powered_off_at is None:
        powered_off_time = datetime.now(timezone(timedelta(hours=0)))
    else:
        powered_off_time = vm.powered_off_at

    created_at_time = vm.created_at

    if created_at_time.tzinfo is None:
        created_at_time = created_at_time.replace(tzinfo=timezone(timedelta(hours=0)))


    vm_total_minutes = (powered_off_time - created_at_time).total_seconds() / 60.0
    return round((vm_total_minutes * TOTAL_CREDITS_MINUTE) + 1)

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

        res = requests.get("http://biocloudlabs.es:4000/vm/setup")
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

        res = requests.get(f"http://biocloudlabs.es:4000/vm/poweroff/{vm_name}")
        json_res = res.json()

        if "code" in json_res:
            if json_res["code"] == 500:
                abort(500, message="Error trying to power off a VM, please try again.")

        vm_total_credits = calc_vm_credits_costs(vm)

        try:
            vm.powered_off_at = datetime.now()
            user.credits -= vm_total_credits

            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message=f"An integrity error has ocurred.")

        return {"message": "VM Removed"}, 200

        
@blp.route("/check/<vm_name>")
class CheckCredits(MethodView):

    def get(self, vm_name):

        vm = models.VirtualMachineModel.query.filter_by(name=vm_name).one_or_404(description="VM not found")
        user = models.UserModel.query.filter_by(id=vm.user_id).one_or_404(description="User not found")
        user_credits = user.credits

        if vm.powered_off_at is not None:
            return {"message": "VM Already Powered off"}, 200

        vm_actual_cost = calc_vm_credits_costs(vm)

        credits_left = user_credits - vm_actual_cost

        if credits_left <= 0:
            requests.get(f"http://biocloudlabs.es:4000/vm/poweroff/{vm_name.split('.')[0]}")

            vm.powered_off_at = datetime.now()
            user.credits = 0
            db.session.commit()

            username = user.name + " " + user.surname

            email_sender.poweroff_machine(vm_name, user.email, username)

            return {"message": "VM Powered off"}, 200

        return {"message": "VM Checked"}, 200
    

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
    