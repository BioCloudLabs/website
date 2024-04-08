from marshmallow import Schema, fields

class UserProfileSchema(Schema):
    email = fields.Email(dump_only=True)
    password = fields.Str(required=True)
    name = fields.Str(required=True)
    surname = fields.Str(required=True)
    credits = fields.Int(dump_only=True)
    location_id = fields.Int(required=True)
    role_id = fields.Int(dump_only=True)