from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(35), nullable=False)
    quantity_instock = Column(Integer, default=0)
    quantity_sold = Column(Integer, default=0)
    price = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)
    supplier_id = Column(Integer, nullable=False)  # just an int, no FK to other DB