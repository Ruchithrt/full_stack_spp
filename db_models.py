from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), nullable=False)
    company = Column(String(20), nullable=False)
    email = Column(String(30), nullable=False)
    phone = Column(String(10), nullable=False)

    # relationship to Product
    products = relationship("Product", back_populates="supplier")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(35), nullable=False)
    quantity_instock = Column(Integer, default=0)
    quantity_sold = Column(Integer, default=0)
    price = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)

    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    supplier = relationship("Supplier", back_populates="products")
