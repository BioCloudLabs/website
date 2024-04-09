from flask.views import MethodView
import stripe
from flask import redirect
from flask_smorest import Blueprint
import os

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
    def post(self, data):
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': data['price_id'],
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

        # return 204
        return {"url": checkout_session.url}, 201