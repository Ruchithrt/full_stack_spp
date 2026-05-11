from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base


Base = declarative_base()

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), nullable=False)
    company = Column(String(20), nullable=False)
    email = Column(String(30), nullable=False)
    phone = Column(String(10), nullable=False)