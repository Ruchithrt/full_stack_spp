from confluent_kafka import Consumer, KafkaError
from db import SessionLocal
from db_models import AnalyticsSummary, LowStockProduct, RecentEvent
import json
import time

LOW_STOCK_THRESHOLD = 10

def add_recent_event(db, event_type: str, topic: str, data: dict):
    db.add(RecentEvent(
        event_type=event_type,
        topic=topic,
        entity_name=data.get("name"),
        entity_company=data.get("company")
    ))
    db.flush()

    # keep only last 10
    all_events = db.query(RecentEvent).order_by(RecentEvent.id.desc()).all()
    if len(all_events) > 10:
        for old in all_events[10:]:
            db.delete(old)

def handle_product_event(db, event_type: str, data: dict):
    summary = db.query(AnalyticsSummary).filter(AnalyticsSummary.id == 1).first()

    if event_type == "product_added":
        summary.total_products += 1
        summary.total_revenue += data.get("price", 0) * data.get("quantity_sold", 0)
        summary.total_quantity_sold += data.get("quantity_sold", 0)

        if data.get("quantity_instock", 0) < LOW_STOCK_THRESHOLD:
            exists = db.query(LowStockProduct).filter(
                LowStockProduct.product_id == data.get("product_id")
            ).first()
            if not exists:
                db.add(LowStockProduct(
                    product_id=data.get("product_id"),
                    name=data.get("name"),
                    quantity_instock=data.get("quantity_instock")
                ))

    elif event_type == "product_updated":
        summary.total_revenue += data.get("price", 0) * data.get("quantity_sold", 0)
        summary.total_quantity_sold += data.get("quantity_sold", 0)

        existing = db.query(LowStockProduct).filter(
            LowStockProduct.product_id == data.get("product_id")
        ).first()

        if data.get("quantity_instock", 0) < LOW_STOCK_THRESHOLD:
            if existing:
                existing.quantity_instock = data.get("quantity_instock")
                existing.name = data.get("name")
            else:
                db.add(LowStockProduct(
                    product_id=data.get("product_id"),
                    name=data.get("name"),
                    quantity_instock=data.get("quantity_instock")
                ))
        else:
            if existing:
                db.delete(existing)

    elif event_type == "product_deleted":
        summary.total_products = max(0, summary.total_products - 1)
        existing = db.query(LowStockProduct).filter(
            LowStockProduct.product_id == data.get("product_id")
        ).first()
        if existing:
            db.delete(existing)

def handle_supplier_event(db, event_type: str, data: dict):
    summary = db.query(AnalyticsSummary).filter(AnalyticsSummary.id == 1).first()

    if event_type == "supplier_added":
        summary.total_suppliers += 1

    elif event_type == "supplier_deleted":
        summary.total_suppliers = max(0, summary.total_suppliers - 1)

def start_consumer():
    print("[Analytics] Waiting for Kafka...")
    time.sleep(15)

    consumer = Consumer({
        "bootstrap.servers": "kafka:9092",
        "group.id": "analytics-service-group",
        "auto.offset.reset": "earliest"
    })

    consumer.subscribe(["product-events", "supplier-events"])
    print("[Analytics] Subscribed to product-events and supplier-events")

    while True:
        msg = consumer.poll(timeout=1.0)

        if msg is None:
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            elif msg.error().code() == KafkaError.UNKNOWN_TOPIC_OR_PART:
                print("[Analytics] Topic not ready yet, waiting...")
                time.sleep(5)
                continue
            else:
                print(f"[Analytics] Kafka error: {msg.error()}")
                continue

        event = json.loads(msg.value().decode("utf-8"))
        topic = msg.topic()
        event_type = event.get("event")
        data = event.get("data")

        print(f"[Analytics] Received → {topic}: {event_type}")

        db = SessionLocal()
        try:
            if topic == "product-events":
                handle_product_event(db, event_type, data)
            elif topic == "supplier-events":
                handle_supplier_event(db, event_type, data)

            add_recent_event(db, event_type, topic, data)
            db.commit()
            print(f"[Analytics] DB updated for {event_type}")

        except Exception as e:
            db.rollback()
            print(f"[Analytics] DB error: {e}")
        finally:
            db.close()