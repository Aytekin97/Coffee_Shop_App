from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from loguru import logger
from typing import List
import os

from models import ProductModel
from schemas import CreateNewProductRequestSchema, ReturnProductsResponseSchema
from database import SessionLocal, Base, engine

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

@app.get("/api/get-products", response_model=List[ReturnProductsResponseSchema])
async def get_products(db: Session = Depends(get_db)):
    """
    Returns all products in the database.
    """
    try:
        products = db.query(ProductModel).all()
        return products
    except Exception as e:
        logger.error("Error retrieving products: %s", str(e))
        raise HTTPException(status_code=500, detail="An error occurred while retrieving products.")
    

@app.post("/api/create-product", response_model=ReturnProductsResponseSchema)
async def create_product(
    product: CreateNewProductRequestSchema,
    db: Session = Depends(get_db)
):
    """
    Create a new product in the database.
    """
    try:
        # Create a new product using values from the request schema
        new_product = ProductModel(**product.dict())
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return JSONResponse(
            status_code=200,
            content={"message": "Product created successfully."}
        )
    except Exception as e:
        db.rollback()
        logger.error("Error creating product: %s", str(e))
        raise HTTPException(status_code=500, detail="An error occurred while creating the product.")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)