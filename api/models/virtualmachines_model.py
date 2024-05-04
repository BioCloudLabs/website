from sqlalchemy.sql import func
from database import db
from sqlalchemy.orm import relationship

class VirtualMachineModel(db.Model):
    __tablename__ = "virtualmachines"
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20))
    ip = db.Column(db.String(20))
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    poweredof_at = db.Column(db.DateTime(timezone=True), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = relationship("UserModel", back_populates="virtualmachines")