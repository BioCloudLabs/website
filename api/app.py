from flask import Flask, send_from_directory, request
from blocklist import BLOCKLIST
from flask_smorest import Api
import models
import os 
from flask_jwt_extended import JWTManager
from database import db
from flask_migrate import Migrate
from controllers.user import blp as UserBlueprint
from controllers.stripe import blp as StripeBlueprint
from controllers.azuredata import blp as AzuredataBlueprint
from controllers.azurevm import blp as AzureVmBlueprint
from dotenv import load_dotenv

app: Flask = Flask(__name__, static_folder="dist", static_url_path="/")

load_dotenv()

app.config["API_TITLE"] = os.getenv("API_TITLE")
app.config["API_VERSION"] = os.getenv("API_VERSION")
app.config["OPENAPI_VERSION"] = os.getenv("OPENAPI_VERSION")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("TEST_SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

db.init_app(app)

Migrate(app, db)

api: Api = Api(app)

api.register_blueprint(UserBlueprint)
api.register_blueprint(StripeBlueprint)
api.register_blueprint(AzuredataBlueprint)
api.register_blueprint(AzureVmBlueprint)


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLOCKLIST


@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return {"message": "The token has been revoked.", "error": "token_revoked"}, 401

# This section adds test data for integrity checking

with app.app_context():

    locations = [
        {"name": "eastus", "display_name": "(US) East US"},
        {"name": "eastus2", "display_name": "(US) East US 2"},
        {"name": "southcentralus", "display_name": "(US) South Central US"},
        {"name": "westus2", "display_name": "(US) West US 2"},
        {"name": "westus3", "display_name": "(US) West US 3"},
        {"name": "australiaeast", "display_name": "(Asia Pacific) Australia East"},
        {"name": "southeastasia", "display_name": "(Asia Pacific) Southeast Asia"},
        {"name": "northeurope", "display_name": "(Europe) North Europe"},
        {"name": "swedencentral", "display_name": "(Europe) Sweden Central"},
        {"name": "uksouth", "display_name": "(Europe) UK South"},
        {"name": "westeurope", "display_name": "(Europe) West Europe"},
        {"name": "centralus", "display_name": "(US) Central US"},
        {"name": "southafricanorth", "display_name": "(Africa) South Africa North"},
        {"name": "centralindia", "display_name": "(Asia Pacific) Central India"},
        {"name": "eastasia", "display_name": "(Asia Pacific) East Asia"},
        {"name": "japaneast", "display_name": "(Asia Pacific) Japan East"},
        {"name": "koreacentral", "display_name": "(Asia Pacific) Korea Central"},
        {"name": "canadacentral", "display_name": "(Canada) Canada Central"},
        {"name": "francecentral", "display_name": "(Europe) France Central"},
        {"name": "germanywestcentral", "display_name": "(Europe) Germany West Central"},
        {"name": "norwayeast", "display_name": "(Europe) Norway East"},
        {"name": "polandcentral", "display_name": "(Europe) Poland Central"},
        {"name": "switzerlandnorth", "display_name": "(Europe) Switzerland North"},
        {"name": "uaenorth", "display_name": "(Middle East) UAE North"},
        {"name": "brazilsouth", "display_name": "(South America) Brazil South"},
        {"name": "centraluseuap", "display_name": "(US) Central US EUAP"},
        {"name": "qatarcentral", "display_name": "(Middle East) Qatar Central"},
        {"name": "centralusstage", "display_name": "(US) Central US (Stage)"},
        {"name": "eastusstage", "display_name": "(US) East US (Stage)"},
        {"name": "eastus2stage", "display_name": "(US) East US 2 (Stage)"},
        {"name": "northcentralusstage", "display_name": "(US) North Central US (Stage)"},
        {"name": "southcentralusstage", "display_name": "(US) South Central US (Stage)"},
        {"name": "westusstage", "display_name": "(US) West US (Stage)"},
        {"name": "westus2stage", "display_name": "(US) West US 2 (Stage)"},
        {"name": "asia", "display_name": "Asia"},
        {"name": "asiapacific", "display_name": "Asia Pacific"},
        {"name": "australia", "display_name": "Australia"},
        {"name": "brazil", "display_name": "Brazil"},
        {"name": "canada", "display_name": "Canada"},
        {"name": "europe", "display_name": "Europe"},
        {"name": "france", "display_name": "France"},
        {"name": "germany", "display_name": "Germany"},
        {"name": "global", "display_name": "Global"},
        {"name": "india", "display_name": "India"},
        {"name": "japan", "display_name": "Japan"},
        {"name": "korea", "display_name": "Korea"},
        {"name": "norway", "display_name": "Norway"},
        {"name": "singapore", "display_name": "Singapore"},
        {"name": "southafrica", "display_name": "South Africa"},
        {"name": "switzerland", "display_name": "Switzerland"},
        {"name": "uae", "display_name": "United Arab Emirates"},
        {"name": "uk", "display_name": "United Kingdom"},
        {"name": "unitedstates", "display_name": "United States"},
        {"name": "unitedstateseuap", "display_name": "United States EUAP"},
        {"name": "eastasiastage", "display_name": "(Asia Pacific) East Asia (Stage)"},
        {"name": "southeastasiastage", "display_name": "(Asia Pacific) Southeast Asia (Stage)"},
        {"name": "brazilus", "display_name": "(South America) Brazil US"},
        {"name": "eastusstg", "display_name": "(US) East US STG"},
        {"name": "northcentralus", "display_name": "(US) North Central US"},
        {"name": "westus", "display_name": "(US) West US"},
        {"name": "jioindiawest", "display_name": "(Asia Pacific) Jio India West"},
        {"name": "eastus2euap", "display_name": "(US) East US 2 EUAP"},
        {"name": "southcentralusstg", "display_name": "(US) South Central US STG"},
        {"name": "westcentralus", "display_name": "(US) West Central US"},
        {"name": "southafricawest", "display_name": "(Africa) South Africa West"},
        {"name": "australiacentral", "display_name": "(Asia Pacific) Australia Central"},
        {"name": "australiacentral2", "display_name": "(Asia Pacific) Australia Central 2"},
        {"name": "australiasoutheast", "display_name": "(Asia Pacific) Australia Southeast"},
        {"name": "japanwest", "display_name": "(Asia Pacific) Japan West"},
        {"name": "jioindiacentral", "display_name": "(Asia Pacific) Jio India Central"},
        {"name": "koreasouth", "display_name": "(Asia Pacific) Korea South"},
        {"name": "southindia", "display_name": "(Asia Pacific) South India"},
        {"name": "westindia", "display_name": "(Asia Pacific) West India"},
        {"name": "canadaeast", "display_name": "(Canada) Canada East"},
        {"name": "francesouth", "display_name": "(Europe) France South"},
        {"name": "germanynorth", "display_name": "(Europe) Germany North"},
        {"name": "norwaywest", "display_name": "(Europe) Norway West"},
        {"name": "switzerlandwest", "display_name": "(Europe) Switzerland West"},
        {"name": "ukwest", "display_name": "(Europe) UK West"},
        {"name": "uaecentral", "display_name": "(Middle East) UAE Central"},
        {"name": "brazilsoutheast", "display_name": "(South America) Brazil Southeast"}
    ]

    location_objects = []
    for location in locations:
        location_objects.append(models.LocationModel(name=location["name"], display_name=location["display_name"]))

    new_role = models.RoleModel(
        name="registered"
    )

    new_role2 = models.RoleModel(
        name="staff"
    )


    new_role3 = models.RoleModel(
        name="admin"
    )
    
    # Uncomment these lines to add the default and test roles and locations
    # db.session.add(new_role)
    # db.session.add(new_role2)
    # db.session.add(new_role3)
    # db.session.add_all(location_objects)
     
    
    # # Commit the changes to persist them in the database
    # db.session.commit()

@app.route("/")
def serve():
    """serves React App"""
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def static_proxy(path):
    """static folder serve"""
    file_name = path.split("/")[-1]
    dir_name = os.path.join(app.static_folder, "/".join(path.split("/")[:-1]))
    return send_from_directory(dir_name, file_name)


@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith("/api/"):
        return {"message": "Resource not found"}, 404
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(405)
def handle_405(e):
    if request.path.startswith("/api/"):
        return {"message": "Mehtod not allowed"}, 405
    return e