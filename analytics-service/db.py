from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_models import Base, AnalyticsSummary

DATABASE_URL = "sqlite:///./analytics.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# create tables
Base.metadata.create_all(bind=engine)

# seed the single summary row if it doesn't exist
def init_summary():
    db = SessionLocal()
    try:
        exists = db.query(AnalyticsSummary).filter(AnalyticsSummary.id == 1).first()
        if not exists:
            db.add(AnalyticsSummary(
                id=1,
                total_products=0,
                total_suppliers=0,
                total_revenue=0.0,
                total_quantity_sold=0
            ))
            db.commit()
    finally:
        db.close()