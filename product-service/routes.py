from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from db_models import Product
from models import ProductCreate, ProductResponse
from typing import List
from kafka_producer import publish

router = APIRouter(prefix="/products", tags=["Products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProductResponse)
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(
        name=product.name,
        quantity_instock=product.quantity_instock,
        quantity_sold=product.quantity_sold,
        price=product.price,
        revenue=product.quantity_sold * product.price,
        supplier_id=product.supplier_id,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    publish("product-events", "product_added", {
        "product_id": db_product.id,
        "name": db_product.name,
        "supplier_id": db_product.supplier_id,
        "price": db_product.price,
        "quantity_sold": db_product.quantity_sold,       
        "quantity_instock": db_product.quantity_instock
    })
    return db_product

@router.get("/", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"No product found with id: {product_id}")
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_data: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product_data.model_dump().items():
        setattr(db_product, key, value)
    db_product.revenue = db_product.quantity_sold * db_product.price
    db.commit()
    db.refresh(db_product)

    publish("product-events", "product_updated", { 
        "product_id": db_product.id,
        "name": db_product.name,
        "supplier_id": db_product.supplier_id,
        "price": db_product.price,
        "quantity_sold": db_product.quantity_sold,      
        "quantity_instock": db_product.quantity_instock
    })

    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    pid = db_product.id
    sid = db_product.supplier_id
    name = db_product.name

    db.delete(db_product)
    db.commit()

    publish("product-events", "product_deleted", {
        "product_id": pid,
        "supplier_id": sid,
        "name": name
    })

    return {"msg": f"Product {product_id} deleted successfully"}