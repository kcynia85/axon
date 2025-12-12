# Circuit Breaker Pattern (Resilience)

> **Problem:** Kaskadowe awarie. Gdy zewnętrzny serwis (np. OpenAI, API Płatności) pada, Twój system wisi, zużywając zasoby (wątki/połączenia), aż sam padnie.
> **Rozwiązanie:** Circuit Breaker ("Bezpiecznik"). Jeśli serwis sypie błędami, "otwórz obwód" i natychmiast zwracaj błąd (Fail Fast) bez próby połączenia, dając czas na regenerację.

## 🐍 Python Implementation (FastAPI/General)

Użyj biblioteki `pybreaker` lub customowego dekoratora z Redisem (dla systemów rozproszonych).

### A. Simple In-Memory (Single Instance)
```python
import pybreaker
import requests

# Konfiguracja: Otwórz obwód po 5 błędach. Próbuj ponownie po 60 sekundach.
api_breaker = pybreaker.CircuitBreaker(fail_max=5, reset_timeout=60)

@api_breaker
def call_external_api():
    response = requests.get("https://unstable-api.com/data")
    response.raise_for_status()
    return response.json()

# Użycie
try:
    data = call_external_api()
except pybreaker.CircuitBreakerError:
    # Fallback logic
    return {"data": "cached_or_default_value"}
except requests.RequestException:
    # Log error
    pass
```

### B. Distributed (Redis-backed) - Recommended for Production
Gdy masz wiele instancji (kontenerów), stan bezpiecznika musi być współdzielony.

```python
# snippets/circuit_breaker.py
import redis
from functools import wraps
import time

redis_client = redis.Redis(host='localhost', port=6379)

class DistributedCircuitBreaker:
    def __init__(self, service_name, failure_threshold=5, recovery_timeout=60):
        self.service_name = service_name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.FAIL_KEY = f"cb:{service_name}:failures"
        self.STATE_KEY = f"cb:{service_name}:open"

    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 1. Sprawdź czy obwód otwarty
            if redis_client.get(self.STATE_KEY):
                raise Exception(f"CircuitBreaker: {self.service_name} is OPEN")

            try:
                result = func(*args, **kwargs)
                # Sukces? Resetuj licznik błędów (opcjonalnie, lub sliding window)
                # redis_client.delete(self.FAIL_KEY) 
                return result
            except Exception as e:
                # 2. Rejestruj błąd
                failures = redis_client.incr(self.FAIL_KEY)
                if failures >= self.failure_threshold:
                    # 3. Otwórz obwód
                    redis_client.setex(self.STATE_KEY, self.recovery_timeout, "1")
                    redis_client.delete(self.FAIL_KEY) # Reset licznika na następny cykl
                    print(f"CircuitBreaker: Opening circuit for {self.service_name}")
                raise e
        return wrapper

# Użycie
@DistributedCircuitBreaker(service_name="openai_api", failure_threshold=3, recovery_timeout=30)
def generate_text(prompt):
    # Call OpenAI...
    pass
```

## 📜 TypeScript / Node.js Implementation (Opossum)

Standardem w Node.js jest biblioteka `opossum`.

```typescript
import CircuitBreaker from 'opossum';

function asyncFunctionThatCouldFail() {
  return new Promise((resolve, reject) => {
    // Call external service
  });
}

const options = {
  timeout: 3000, // If function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fallback(() => 'Service Unavailable. Please try again later.');

breaker.fire()
  .then(console.log)
  .catch(console.error);
```
