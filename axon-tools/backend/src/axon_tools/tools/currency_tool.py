from . import tool
import httpx
from typing import Dict, Any

@tool("Currency Exchange Rates", keywords=["finance", "currency", "nbp"])
def get_exchange_rate(currency_code: str) -> Dict[str, Any]:
    """
    Pobiera aktualny kurs waluty z NBP (Tabela A).
    Args:
        currency_code: Kod waluty (np. 'USD', 'EUR', 'GBP').
    """
    url = f"https://api.nbp.pl/api/exchangerates/rates/a/{currency_code}/?format=json"
    try:
        with httpx.Client(timeout=10.0) as client:
            r = client.get(url)
            if r.status_code == 200:
                data = r.json()
                rate = data['rates'][0]['mid']
                print(f"SUKCES: Kurs {currency_code}: {rate} PLN")
                return {"currency": currency_code, "rate": rate, "base": "PLN"}
            return {"error": f"Błąd NBP: {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}
