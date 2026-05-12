from fastapi import FastAPI
from routes import router

app = FastAPI(title="Supplier Service")

app.include_router(router)

@app.get("/")
def index():
    return {"service": "supplier-service", "status": "running"}