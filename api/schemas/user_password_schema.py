from marshmallow import Schema, fields, validate

class UserPasswordSchema(Schema):
    old_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=validate.Regexp(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", flags=0, error="New password is not strong enough."))
