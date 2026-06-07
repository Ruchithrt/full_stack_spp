from confluent_kafka import Consumer, KafkaError
import json
import time

def start_consumer():
    print("[Audit] Waiting for Kafka to be ready...")
    time.sleep(15)

    consumer = Consumer({
        "bootstrap.servers": "kafka:9092",
        "group.id": "audit-service-group",
        "auto.offset.reset": "earliest"
    })

    consumer.subscribe(["product-events", "supplier-events"])
    print("[Audit] Subscribed to product-events and supplier-events")

    try:
        while True:
            msg = consumer.poll(timeout=1.0)

            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                elif msg.error().code() == KafkaError.UNKNOWN_TOPIC_OR_PART:
                    # ← topic doesn't exist yet — wait and keep trying
                    print("[Audit] Topic not ready yet, waiting...")
                    time.sleep(5)
                    continue
                else:
                    print(f"[Audit] Error: {msg.error()}")
                    continue                           # ← continue instead of break

            event = json.loads(msg.value().decode("utf-8"))
            topic = msg.topic()
            event_type = event.get("event")
            data = event.get("data")

            log_line = f"[{topic}] {event_type} → {data}\n"
            print(log_line)

            with open("audit.log", "a") as f:
                f.write(log_line)

    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
        print("[Audit] Consumer closed")