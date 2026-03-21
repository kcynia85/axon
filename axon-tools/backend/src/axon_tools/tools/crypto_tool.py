from . import tool
import httpx
from typing import Dict, Any

@tool("Crypto Price Tracker", keywords=["crypto", "finance", "api"])
def get_crypto_price(coin_id: str = "bitcoin") -> Dict[str, Any]:
    """
    Pobiera aktualną cenę kryptowaluty z CoinGecko API.
    Args:
        coin_id: Identyfikator monety (np. 'bitcoin', 'ethereum', 'solana').
    """
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd"
    try:
        with httpx.Client(timeout=10.0) as client:
            r = client.get(url)
            if r.status_code == 200:
                data = r.json()
                if coin_id in data:
                    price = data[coin_id]['usd']
                    print(f"SUKCES: Cena {coin_id}: ${price}")
                    return {"coin": coin_id, "price_usd": price}
                return {"error": "Nie znaleziono monety"}
            return {"error": f"Błąd API: {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}
