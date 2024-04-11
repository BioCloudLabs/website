from flask.views import MethodView
import stripe
from flask_smorest import Blueprint
import os
import models
import schemas
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity

blp = Blueprint("stripe", __name__, description="Stripe endpoint", url_prefix="/stripe")

YOUR_DOMAIN = 'http://localhost:5173'
stripe.api_key = os.getenv("STRIPE_KEY")

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

            db.session.add(invoice)

            db.session.commit()

            checkout_session = stripe.checkout.Session.create(
                metadata={"order_id": "6735"},
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