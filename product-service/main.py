from fastapi import FastAPI
from routes import router

app = FastAPI(title="Product Service")

app.include_router(router)

@app.get("/")
def index():
    return {"service": "product-service", "status": "running"}