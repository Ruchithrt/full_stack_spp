from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import SessionLocal
from db_models import AnalyticsSummary, LowStockProduct, RecentEvent
from models import AnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    summary = db.query(AnalyticsSummary).filter(AnalyticsSummary.id == 1).first()
    low_stock = db.query(LowStockProduct).all()
    recent = db.query(RecentEvent).order_by(RecentEvent.id.desc()).limit(10).all()

    return AnalyticsResponse(
        total_products=summary.total_products,
        total_suppliers=summary.total_suppliers,
        total_revenue=round(summary.total_revenue, 2),
        total_quantity_sold=summary.total_quantity_sold,
        low_stock_products=low_stock,
        recent_events=recent
    )