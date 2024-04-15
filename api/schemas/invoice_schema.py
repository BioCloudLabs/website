from marshmallow import Schema, fields, validate

class InvoiceSchema(Schema):
    price = fields.Float(required=True)
    price_id = fields.Str(required=True)
    status = fields.Str(dump_only=True, validate=validate.OneOf(["completed", "pending", "expired"]))
    user_id = fields.Integer(dump_only=True)
