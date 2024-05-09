from marshmallow import Schema, fields

class VmSchema(Schema):
    id = fields.Integer(required=True)
