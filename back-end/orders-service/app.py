from collections import Counter
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from loguru import logger
import os

from models import ProductModel, OrderModel, OrderItemModel
from schemas import CreateNewOrderRequestSchema, ReturnOrdersResponseSchema
from database import SessionLocal, Base, engine
from config import settings

DATABASE_URL = settings.db_url

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)
        yield db
    finally:
        db.close()

@app.get("/api/get-orders", response_model=ReturnOrdersResponseSchema)
async def get_orders(user_id: int, db: Session = Depends(get_db)):
    """
    Returns all orders in the database for a specific user, including computed totals.
    """
    try:
        orders = (
            db.query(OrderModel)
            .options(
                joinedload(OrderModel.order_items).joinedload(OrderItemModel.product)
            )
            .filter(OrderModel.user_id == user_id)
            .all()
        )
    
        if not orders:
            raise HTTPException(status_code=404, detail="No orders found for the specified user.")
    
        return {"orders": orders}
    
    except Exception as e:
        logger.error("Error retrieving orders: %s", str(e))
        raise HTTPException(status_code=500, detail="An error occurred while retrieving orders.")

@app.post("/api/create-order")
async def create_order(
    order_request: CreateNewOrderRequestSchema,
    db: Session = Depends(get_db)
):
    """
    Create a new order for the specified user with the provided list of product IDs,
    reduce the available quantity for each product accordingly,
    calculate the subtotal and order total (subtotal + 13% tax),
    and return a confirmation message.
    """
    try:
        logger.info(f"Received order request: {order_request}")
        logger.info(f"Using DB URL: {DATABASE_URL}")
        
        # Create the order record without totals first.
        new_order = OrderModel(user_id=order_request.user_id)
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        logger.info(f"Created order with ID: {new_order.id}")
        
        # Group ordered product IDs by count.
        ordered_counts = Counter(order_request.product_ids)
        
        # For each product in the order, verify stock availability and decrement quantity.
        for product_id, count in ordered_counts.items():
            product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found.")
            if product.quantity < count:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough stock for product '{product.product_name}'. Available: {product.quantity}, Requested: {count}"
                )
            # Reduce available quantity.
            product.quantity -= count
        
        db.commit()
        logger.info("Product quantities updated based on the order.")
        
        # Add an order item for each product ID in the order (duplicates represent multiple orders)
        for product_id in order_request.product_ids:
            order_item = OrderItemModel(order_id=new_order.id, product_id=product_id)
            db.add(order_item)
        db.commit()
        logger.info("Order items added successfully.")
        
        # Calculate subtotal by summing product prices for each order item.
        subtotal = 0.0
        order_items = (
            db.query(OrderItemModel)
            .options(joinedload(OrderItemModel.product))
            .filter(OrderItemModel.order_id == new_order.id)
            .all()
        )
        logger.info(f"Found {len(order_items)} order items for order {new_order.id}")
        for item in order_items:
            if item.product:
                subtotal += item.product.price
            else:
                logger.warning(f"Order item ID {item.id} has no associated product.")
        
        # Calculate total with tax (13%).
        order_total = subtotal * 1.13

        # Update the order with computed totals.
        new_order.subtotal = subtotal
        new_order.order_total = order_total
        db.commit()
    
        return JSONResponse(
            status_code=200,
            content={"message": "Order created successfully."}
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while creating the order: {e}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
