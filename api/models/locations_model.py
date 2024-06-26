from database import db
from sqlalchemy.orm import relationship

class LocationModel(db.Model):
    __tablename__ = "locations"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    display_name = db.Column(db.String, nullable=False)

    users = relationship("UserModel", back_populates="location", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_name': self.display_name,
        }
