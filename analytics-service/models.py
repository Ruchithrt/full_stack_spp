from pydantic import BaseModel
from typing import List

class LowStockProductResponse(BaseModel):
    product_id: int
    name: str
    quantity_instock: int=0

    class Config:
        from_attributes = True

class RecentEventResponse(BaseModel):
    event_type: str
    topic: str
    entity_name: str | None
    entity_company: str | None

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    total_products: int
    total_suppliers: int
    total_revenue: float
    total_quantity_sold: int
    low_stock_products: List[LowStockProductResponse]
    recent_events: List[RecentEventResponse]

    class Config:
        from_attributes = True