from marshmallow import Schema, fields

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)