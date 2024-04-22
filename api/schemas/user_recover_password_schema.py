from marshmallow import Schema, fields

class UserRecoverPasswordEmailSchema(Schema):
    email = fields.Email(required=True)