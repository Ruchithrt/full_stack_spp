from pydantic import BaseModel, Field

class Supplier(BaseModel):
    id:int
    name:str = Field(max_length=50)
    company:str = Field(max_length=30)
    email:str = Field(max_length=30)
    phone:str = Field(max_length=10)

class Product(BaseModel):
    id: int
    name: str = Field(..., max_length=35, min_length=2)
    quantity_instock: int = Field(default=0, ge=0)
    quantity_sold: int = Field(default=0, ge=0)
    price: float = Field(default=0.0, ge=0)
    revenue: float = Field(default=0.0, ge=0)
    supplier: Supplier  
