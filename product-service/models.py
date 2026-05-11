from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    # No id — DB generates it. supplier_id is just a number now.
    name: str = Field(..., max_length=35, min_length=2)
    quantity_instock: int = Field(default=0, ge=0)
    quantity_sold: int = Field(default=0, ge=0)
    price: float = Field(default=0.0, ge=0)
    supplier_id: int  

class ProductResponse(BaseModel):
    id: int
    name: str
    quantity_instock: int
    quantity_sold: int
    price: float
    revenue: float
    supplier_id: int

    class Config:
        from_attributes = True