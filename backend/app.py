from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from model import Supplier
from db import SessionLocal
from db_models import Supplier, Product
from model import Supplier as Supplier_schema, Product as Product_schema
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = [
    'http://localhost:3000',
    'http://localhost:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # list of allowed origins
    allow_credentials=True,         # whether to allow cookies/authorization headers
    allow_methods=["*"],            # list of allowed HTTP methods, "*" means all
    allow_headers=["*"],            # list of allowed headers, "*" means all
)

@app.get("/")
def index():
    return {"msg":"hello"}


@app.post("/add_supplier")
def add_supplier(supplier:Supplier_schema, db:Session = Depends(get_db)):
    db_supplier = Supplier(**supplier.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.get("/get_supplier")
def get_supplier(db:Session = Depends(get_db)):
    return db.query(Supplier).all()

@app.get("/get_supplier/{supplier_id}")
def get_supplier(supplier_id:int, db:Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        return HTTPException(status_code=404, detail=f"No supplier found with id:{id}")
    return supplier
    
@app.put("/update_supplier/{supplier_id}")
def update_supplier(supplier_id:int, supplier_data:Supplier_schema, db:Session=Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id==supplier_id).first()
    if not db_supplier:
        return HTTPException(status_code=404, detail="Not found")
    
    for key, value in supplier_data.model_dump().items():
        setattr(db_supplier, key, value)

    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.delete("/delete_suppliers/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail=f"No supplier found with id: {supplier_id}")

    db.delete(db_supplier)
    db.commit()
    return {"msg": f"Supplier with id {supplier_id} deleted successfully"}



@app.post("/add_product")
def add_product(product:Product_schema, db:Session = Depends(get_db)):

    supplier = db.query(Supplier).filter(Supplier.id==product.supplier.id).first()
    if not supplier:
        return HTTPException(status_code=404, detail="Supplier not found")
    
    db_product = Product(
        name = product.name,
        quantity_instock=product.quantity_instock,
        quantity_sold=product.quantity_sold,
        price=product.price,
        revenue=product.quantity_sold*product.price,
        supplier_id=product.supplier.id
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/get_product")
def get_product(db:Session = Depends(get_db)):
    return db.query(Product).all()

@app.get("/get_product/{product_id}")
def get_product(product_id:int, db:Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return HTTPException(status_code=404, detail=f"No Product found with id:{id}")
    return db_product

@app.put("/update_product/{product_id}")
def update_product(product_id:int, product_data:Product_schema, db:Session=Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    product_dict = product_data.model_dump()

    
    if "supplier" in product_dict:
        supplier_data = product_dict.pop("supplier")
        supplier = db.query(Supplier).filter(Supplier.id == supplier_data["id"]).first()
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        db_product.supplier = supplier

    
    for key, val in product_dict.items():
        setattr(db_product, key, val)

    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/delete_product/{product_id}")
def delete_product (product_id:int, db:Session=Depends(get_db)):
    db_product = db.query(Product).filter(Product.id==product_id).first()
    if not db_product:
        HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()
    return {"msg": f"Supplier with id {product_id} deleted successfully"}