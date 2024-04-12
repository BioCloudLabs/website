from marshmallow import Schema, fields, validate

class InvoiceSchema(Schema):
    price = fields.Float(dump_only=True)
    price_id = fields.Str(required=True)
    status = fields.Str(dump_only=True, validate=validate.OneOf(["failed, completed, pending"]))
    user_id = fields.Integer(dump_only=True)
