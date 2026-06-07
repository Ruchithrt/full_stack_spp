from confluent_kafka import Producer
import json

producer = Producer({
    "bootstrap.servers": "kafka:9092"
})

def delivery_report(err, msg):
    if err:
        print(f"[Kafka] Delivery failed: {err}")
    else:
        print(f"[Kafka] Delivered → topic: {msg.topic()} partition: {msg.partition()}")

def publish(topic: str, event_type: str, data: dict):
    payload = {
        "event": event_type,
        "data": data
    }
    producer.produce(
        topic=topic,
        value=json.dumps(payload).encode("utf-8"),
        callback=delivery_report
    )
    producer.flush()