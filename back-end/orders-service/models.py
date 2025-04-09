from sqlalchemy import Column, Integer, String, DateTime, text, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class ProductModel(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # One product -> many order items
    order_items = relationship(
        "OrderItemModel",
        back_populates="product",
        cascade="all, delete-orphan"
    )
    
class OrderItemModel(Base):
    __tablename__ = "order_item"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)

    # Many order items -> one product
    product = relationship("ProductModel", back_populates="order_items")
    # Many order items -> one order
    order = relationship("OrderModel", back_populates="order_items")

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # One order -> many order items
    order_items = relationship(
        "OrderItemModel",
        back_populates="order",
        cascade="all, delete-orphan"
    )
    # Many orders -> one user
    user = relationship("User", back_populates="orders")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # One user -> many orders
    orders = relationship(
        "OrderModel",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

