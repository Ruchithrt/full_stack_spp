from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from db_models import Supplier
from models import SupplierCreate, SupplierResponse
from typing import List
from kafka_producer import publish 

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=SupplierResponse)
def add_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = Supplier(**supplier.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)

    publish("supplier-events", "supplier_added", { 
        "supplier_id": db_supplier.id,
        "name": db_supplier.name,
        "company": db_supplier.company,
        "email": db_supplier.email
    })

    return db_supplier

@router.get("/", response_model=List[SupplierResponse])
def get_all_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail=f"No supplier found with id: {supplier_id}")
    return supplier

@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, supplier_data: SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    for key, value in supplier_data.model_dump().items():
        setattr(db_supplier, key, value)
    db.commit()
    db.refresh(db_supplier)

    publish("supplier-events", "supplier_updated", {
        "supplier_id": db_supplier.id,
        "name": db_supplier.name,
        "company": db_supplier.company
    })
    return db_supplier

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail=f"No supplier found with id: {supplier_id}")
    
    # save before delete
    sid = db_supplier.id
    name = db_supplier.name
    company = db_supplier.company
    db.delete(db_supplier)
    db.commit()

    publish("supplier-events", "supplier_deleted", { 
        "supplier_id": sid,
        "name": name,
        "company": company
    })

    return {"msg": f"Supplier {supplier_id} deleted successfully"}