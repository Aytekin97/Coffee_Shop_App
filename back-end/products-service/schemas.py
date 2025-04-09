from pydantic import BaseModel
from datetime import datetime


class CreateNewProductRequestSchema(BaseModel):
    product_name: str
    price: float
    description: str
    category: str

class ReturnProductsResponseSchema(BaseModel):
    id: int
    product_name: str
    price: float
    description: str
    category: str
    created_at: datetime

    class Config:
        orm_mode = True
