from marshmallow import Schema, fields

class UserSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    name = fields.Str(required=True)
    surname = fields.Str(required=True)
    credits = fields.Int(required=True)
    location_id = fields.Int(required=True)