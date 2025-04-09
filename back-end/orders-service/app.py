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
    Returns all orders in the database.
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
    and return a confirmation message.
    """
    try:
        logger.info(order_request)
        logger.info(DATABASE_URL)
        # Create the order record
        new_order = OrderModel(user_id=order_request.user_id)
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        # Add an order item for each product ID
        for product_id in order_request.product_ids:
            order_item = OrderItemModel(order_id=new_order.id, product_id=product_id)
            db.add(order_item)
        
        db.commit()
    
        return JSONResponse(
            status_code=200,
            content={"message": "Order created successfully."}
        )
    except Exception as e:
        db.rollback()
        logger.error("Error creating order: %s", str(e))
        raise HTTPException(status_code=500, detail="An error occurred while creating the order.")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)