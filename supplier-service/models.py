from pydantic import BaseModel, Field

class SupplierCreate(BaseModel):
    # No id here — DB auto-generates it on creation
    name: str = Field(max_length=20)
    company: str = Field(max_length=20)
    email: str = Field(max_length=30)
    phone: str = Field(max_length=10)

class SupplierResponse(BaseModel):
    id: int
    name: str
    company: str
    email: str
    phone: str

    class Config:
        from_attributes = True  # lets Pydantic read SQLAlchemy objects