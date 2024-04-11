from sqlalchemy.sql import func
from database import db
from sqlalchemy.orm import relationship

class InvoiceModel(db.Model):
    __tablename__ = "invoices"
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float)
    status = db.Column(db.String(20))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = relationship("UserModel", back_populates="invoices")


db.Index('ix_invoice_status', InvoiceModel.status)
db.CheckConstraint(InvoiceModel.status.in_(['pending', 'completed', 'failed']), name='status_check')
