# Snippet: Transactional Outbox Pattern (Operationalized)

> **Context:** Use this snippet when you need to write to DB and publish an Event atomically.
> **Stack:** Postgres + Python (SQLAlchemy) / Node.js (Prisma/TypeORM)
> **Guardrails:** Includes `SKIP LOCKED` to prevent race conditions.

---

## 1. Database Schema (Postgres)

Don't invent the schema. Use this one.

```sql
CREATE TABLE outbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id VARCHAR(255) NOT NULL, -- e.g., Order ID
    aggregate_type VARCHAR(255) NOT NULL, -- e.g., "ORDER"
    event_type VARCHAR(255) NOT NULL, -- e.g., "ORDER_CREATED"
    payload JSONB NOT NULL, -- The actual event data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE, -- NULL = pending
    error_log TEXT
);

-- Index for faster polling
CREATE INDEX idx_outbox_pending ON outbox_messages (created_at) WHERE processed_at IS NULL;
```

---

## 2. The Worker (Python / SQLAlchemy)

Use `FOR UPDATE SKIP LOCKED` to allow multiple workers to process events in parallel without conflicts.

```python
import time
from sqlalchemy import text
from my_app.db import SessionLocal

def run_outbox_worker():
    while True:
        with SessionLocal() as session:
            # 1. Fetch pending events with lock
            # LIMIT 10 to batch process
            stmt = text("""
                SELECT id, payload, event_type 
                FROM outbox_messages 
                WHERE processed_at IS NULL 
                ORDER BY created_at ASC 
                LIMIT 10 
                FOR UPDATE SKIP LOCKED
            """)
            
            events = session.execute(stmt).fetchall()
            
            if not events:
                time.sleep(1) # No events, sleep
                continue

            for event in events:
                try:
                    # 2. Publish to Broker (e.g., RabbitMQ, Kafka, SQS)
                    publish_to_broker(event.event_type, event.payload)
                    
                    # 3. Mark as processed
                    session.execute(
                        text("UPDATE outbox_messages SET processed_at = NOW() WHERE id = :id"),
                        {"id": event.id}
                    )
                except Exception as e:
                    # Log error, maybe set retry count
                    session.execute(
                        text("UPDATE outbox_messages SET error_log = :err WHERE id = :id"),
                        {"err": str(e), "id": event.id}
                    )
            
            session.commit()
```

---

## 3. Idempotency Implementation

**Rule:** The `payload` MUST contain an `idempotency_key` (usually the `id` of the outbox message itself is a good candidate for the consumer to track).

**Consumer Side Logic:**
```python
def on_message_received(event):
    if has_processed(event.id):
        return # Skip duplicate
    
    process_business_logic(event)
    mark_as_processed(event.id)
```
