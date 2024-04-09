from flask import Flask, jsonify
from flask_smorest import Api
import models
import base64
import os 
from flask_jwt_extended import JWTManager
from database import db
from flask_migrate import Migrate
from datetime import datetime
from controllers.user import blp as UserBlueprint
from controllers.stripe import blp as StripeBlueprint
from dotenv import load_dotenv

app: Flask = Flask(__name__)

load_dotenv()

app.config["API_TITLE"] = os.getenv("API_TITLE")
app.config["API_VERSION"] = os.getenv("API_VERSION")
app.config["OPENAPI_VERSION"] = os.getenv("OPENAPI_VERSION")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

db.init_app(app)

Migrate(app, db)

api: Api = Api(app)

api.register_blueprint(UserBlueprint)
api.register_blueprint(StripeBlueprint)

# This section adds test data for integrity checking


import stripe
# This is your test secret API key.
stripe.api_key = 'sk_test_51P1tyaKxx03CCQEhBDasgTLkXHXaajJeS4253ej2FQvFB1YohuSGgykNEyVeQMWV09QhJk3cxHfJDl1AmKZWCAFK00UdYx6MnN'

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

YOUR_DOMAIN = 'http://localhost:5173'

@app.route('/stripe/create-checkout-sessionn', methods=['POST'])
def createe_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': 'price_1P3K8zKxx03CCQEhdO1g0mBB',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
            automatic_tax={'enabled': True},
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)

with app.app_context():
    new_role = models.RoleModel(
        name="registered"
    )

    new_role2 = models.RoleModel(
        name="staff"
    )


    new_role3 = models.RoleModel(
        name="admin"
    )


    new_location = models.LocationModel(
        name="España"
    )

    new_location2 = models.LocationModel(
        name="Portugal"
    )

    
# Uncomment these lines to add the default and test roles and locations
# db.session.add(new_role)
# db.session.add(new_role2)
# db.session.add(new_role3)
# db.session.add(new_location)
# db.session.add(new_location2)
   
# Commit the changes to persist them in the database
# db.session.commit()



