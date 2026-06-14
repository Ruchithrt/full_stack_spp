from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class AnalyticsSummary(Base):
    __tablename__ = "analytics_summary"

    id = Column(Integer, primary_key=True, index=True)  # always one row, id=1
    total_products = Column(Integer, default=0)
    total_suppliers = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)
    total_quantity_sold = Column(Integer, default=0)


class LowStockProduct(Base):
    __tablename__ = "low_stock_products"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, unique=True, nullable=False)
    name = Column(String, nullable=False)
    quantity_instock = Column(Integer, default=0)


class RecentEvent(Base):
    __tablename__ = "recent_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    entity_name = Column(String)
    entity_company = Column(String)