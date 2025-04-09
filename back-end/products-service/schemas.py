from pydantic import BaseModel
from datetime import datetime

class CreateNewProductRequestSchema(BaseModel):
    product_name: str
    price: float
    description: str
    category: str
    quantity: int   # NEW field for stock quantity

class ReturnProductsResponseSchema(BaseModel):
    id: int
    product_name: str
    price: float
    description: str
    category: str
    quantity: int   # NEW: return the quantity in stock
    created_at: datetime

    class Config:
        orm_mode = True
