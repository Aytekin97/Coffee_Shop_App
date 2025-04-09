from pydantic import BaseModel
from datetime import datetime
from typing import List

class CreateNewOrderRequestSchema(BaseModel):
    user_id: int
    product_ids: List[int]

class ProductsSchema(BaseModel):
    id: int
    product_name: str
    price: float
    description: str
    category: str
    created_at: datetime

    class Config:
        orm_mode = True

class OrderItemSchema(BaseModel):
    id: int
    product: ProductsSchema

    class Config:
        orm_mode = True

class OrderSchema(BaseModel):
    id: int
    created_at: datetime
    subtotal: float       # New field for subtotal
    order_total: float    # New field for order total with tax
    order_items: List[OrderItemSchema]

    class Config:
        orm_mode = True

class ReturnOrdersResponseSchema(BaseModel):
    orders: List[OrderSchema]
