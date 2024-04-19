from marshmallow import Schema, fields, validate

class UserRegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Regexp(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", flags=0, error="Password is not strong enough."))
    name = fields.Str(required=True)
    surname = fields.Str(required=True)
    credits = fields.Int(dump_only=True)
    location_id = fields.Int(required=True)
    role_id = fields.Int(dump_only=True)