from flask.views import MethodView
import stripe
from flask_smorest import Blueprint, abort
import os
import models
import schemas
from database import db
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

blp = Blueprint("stripe", __name__, description="Stripe endpoint", url_prefix="/api/stripe")

DOMAIN = os.getenv("DOMAIN_URL")
stripe.api_key = os.getenv("STRIPE_KEY")
ENDPOINT_SECRET = os.getenv("ENDPOINT_SECRET")

def getProducts():
    """
    Function that retrieve all the products on stripe
    :return data: Return a json with all the stripe products
    """
    data = {"products": []}
    try:
        products = stripe.Product.list(limit=10)
        for product in products["data"]:
            price = stripe.Price.retrieve(product["default_price"])
            data["products"].append({"name": product["name"],
                                     "price_id": product["default_price"], 
                                     "price": "{:.2f}".format(price["unit_amount"]/100) + " €",
                                     "credits": int(product["name"].replace(' Credits', ''))})
        return data
    except Exception as e:
        return {"error": str(e)}, 503

@blp.route("/products")
class GetProducts(MethodView):
    def get(self):
        return getProducts()

@blp.route("/create-checkout-session")
class PaymentIntent(MethodView):
    @jwt_required()
    @blp.arguments(schemas.InvoiceSchema)
    def post(self, payload):

        user_id = get_jwt_identity() # Get the user id from the jwt

        credits = 0

        PRODUCTS = getProducts()

        for product in PRODUCTS["products"]:
            price = "{:.2f} €".format(float(payload['price']))
            if product["price"] == price:
                credits += int(product["credits"])

        try:
            invoice = models.InvoiceModel(
                price=payload['price'],
                status="pending",
                user_id=user_id,
                credits=credits
            )

            db.session.add(invoice)

            db.session.commit() # Commit the invoice to the database
            
            invoice_id = invoice.id

            checkout_session = stripe.checkout.Session.create(
                metadata={"invoice_id": invoice_id, "user_id": user_id, "credits": credits},
                line_items=[
                    {
                        'price': payload['price_id'],
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=DOMAIN + '/success',
                cancel_url=DOMAIN + '/cancelled',
                automatic_tax={'enabled': True},
            )

        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))
        
        return {"url": checkout_session.url}, 201
    
@blp.route("/webhook")
class StripeWebhook(MethodView):
    def post(self):
        event = None
        payload = request.data
        sig_header = request.headers['STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, ENDPOINT_SECRET
            )
        except ValueError as e:
            # Invalid payload
            raise e
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            raise e

        # Handle the event
        metadata = event['data']['object']['metadata']
        match event['type']:
            case 'checkout.session.completed':
                user = db.session.get(models.UserModel, metadata['user_id'])
                user.credits += int(metadata["credits"])

                invoice = db.session.get(models.InvoiceModel, metadata['invoice_id'])
                invoice.status = "completed"
                db.session.commit()
            case 'checkout.session.expired':
                invoice = db.session.get(models.InvoiceModel, metadata['invoice_id'])
                invoice.status = "expired"
                db.session.commit()

        return {"success": True}, 200
    