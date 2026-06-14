from fastapi import FastAPI
from contextlib import asynccontextmanager
from db import init_summary
from routes import router
from consumer import start_consumer
import threading

@asynccontextmanager
async def lifespan(app: FastAPI):
    # runs on startup
    init_summary()
    thread = threading.Thread(target=start_consumer, daemon=True)
    thread.start()
    print("[Analytics] Consumer thread started")
    
    yield                          
    # runs on shutdown (put cleanup here if needed)
    print("[Analytics] Shutting down")

app = FastAPI(title="Analytics Service", lifespan=lifespan)

app.include_router(router)

@app.get("/")
def index():
    return {"service": "analytics-service", "status": "running"}