from flask.views import MethodView
import stripe
from flask_smorest import Blueprint
import os
import models
import schemas
from database import db
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

blp = Blueprint("stripe", __name__, description="Stripe endpoint", url_prefix="/stripe")

YOUR_DOMAIN = 'http://localhost:5173'
stripe.api_key = os.getenv("STRIPE_KEY")
endpoint_secret = 'whsec_904e9073d0659942b0df7cce3efa2c65d6d3dfb3e5073ff021666a2e66a9b7f3'

@blp.route("/products")
class GetProducts(MethodView):
    def get(self):
        data = {"products": []}
        try:
            products = stripe.Product.list(limit=10)
            for product in products["data"]:
                price = stripe.Price.retrieve(product["default_price"])
                data["products"].append({"name": product["name"], "price_id": product["default_price"], 
                                         "price": "{:.2f}".format(price["unit_amount"]/100) + " €"})
            return data
        except Exception as e:
            return str(e)

@blp.route("/create-checkout-session")
class PaymentIntent(MethodView):
    @jwt_required()
    @blp.arguments(schemas.InvoiceSchema)
    def post(self, payload):

        try:
            invoice = models.InvoiceModel(
                price=payload['price'],
                status="pending",
                user_id=get_jwt_identity()
            )

            invoice_id = invoice.id

            db.session.add(invoice)

            db.session.commit()

            checkout_session = stripe.checkout.Session.create(
                metadata={
                    "invoice_id": invoice_id
                    },
                line_items=[
                    {
                        'price': payload['price_id'],
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=YOUR_DOMAIN + '?success=true',
                cancel_url=YOUR_DOMAIN + '?canceled=true',
                automatic_tax={'enabled': True},
            )

        except Exception as e:
            db.session.rollback()
            return str(e)
        
        return {"url": checkout_session.url}, 201
    
@blp.route("/webhook")
class StripeWebhook(MethodView):
    def post(self):
        event = None
        payload = request.data
        sig_header = request.headers['STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            raise e
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            raise e

        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            print('completed')
            print(session['metadata'])
        elif event['type'] == 'checkout.session.expired':
            session = event['data']['object']
            print('expired')
            print(session['metadata'])
        elif event['type'] == 'checkout.session.cancelled':
            session = event['data']['object']
            print('expired')
            print(session['metadata'])
        else:
            print('Unhandled event type {}'.format(event['type']))

        return {"success": True}, 200
    