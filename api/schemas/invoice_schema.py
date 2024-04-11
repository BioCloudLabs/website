from marshmallow import Schema, fields, validate

class InvoiceSchema(Schema):
    price = fields.Float(required=True)
    price_id = fields.Str(required=True)
    status = fields.Str(required=True, validate=validate.OneOf(["failed, completed, pending"]))
    user_id = fields.Integer(required=True)