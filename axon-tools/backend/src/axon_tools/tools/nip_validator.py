from . import tool
import httpx
from datetime import date
from typing import Dict, Any, Union

@tool("Polish Company Lookup (NIP)", keywords=["finance", "poland", "verification"])
def lookup_company_by_nip(nip: str) -> Dict[str, Any]:
    """
    Weryfikuje NIP i pobiera dane firmy z Wykazu Podatników VAT (Biała Lista).
    Zwraca szczegółowe dane podmiotu, takie jak nazwa, status VAT, adres i numery kont.
    
    Args:
        nip: 10-cyfrowy Numer Identyfikacji Podatkowej.
        
    Returns:
        Słownik z danymi firmy lub informacją o błędzie.
    """
    # 1. Local Validation
    clean_nip = nip.replace("-", "").replace(" ", "")
    
    if len(clean_nip) != 10 or not clean_nip.isdigit():
        return {"error": "Nieprawidłowy format NIP. Numer musi składać się z 10 cyfr."}
        
    weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
    checksum = sum(int(clean_nip[i]) * weights[i] for i in range(9))
    control_digit = checksum % 11
    
    if control_digit == 10 or control_digit != int(clean_nip[9]):
        return {"error": "Nieprawidłowa suma kontrolna NIP."}

    # 2. Remote Lookup (Biała Lista MF)
    today = date.today().strftime("%Y-%m-%d")
    url = f"https://wl-api.mf.gov.pl/api/search/nip/{clean_nip}?date={today}"
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            
            if response.status_code == 200:
                data = response.json()
                result = data.get("result", {})
                subject = result.get("subject")
                
                if subject:
                    company_name = subject.get("name")
                    # Print prominently so it appears in the Tester "Output Buffer"
                    print(f"SUKCES: Znaleziono podmiot: {company_name}")
                    
                    return {
                        "status": "Found",
                        "full_name": company_name,
                        "nip": subject.get("nip"),
                        "status_vat": subject.get("statusVat"),
                        "address": subject.get("workingAddress") or subject.get("residenceAddress"),
                        "registration_date": subject.get("registrationLegalDate"),
                        "has_virtual_accounts": subject.get("hasVirtualAccounts"),
                        "account_numbers": subject.get("accountNumbers", []),
                        "request_id": result.get("requestId")
                    }
                else:
                    return {"status": "Not Found", "message": "Nie znaleziono podmiotu o podanym numerze NIP w bazie danych MF."}
            
            elif response.status_code == 400:
                return {"error": "Błędne zapytanie do bazy MF."}
            elif response.status_code == 429:
                return {"error": "Przekroczono limit zapytań do bazy MF. Spróbuj później."}
            else:
                return {"error": f"Błąd zewnętrznej bazy danych (Kod: {response.status_code})"}
                
    except Exception as e:
        return {"error": f"Wystąpił problem z połączeniem: {str(e)}"}

@tool("Polish NIP Validator", keywords=["finance", "poland", "validation"])
def validate_nip(nip: str) -> bool:
    """
    Weryfikuje poprawność polskiego Numeru Identyfikacji Podatkowej (NIP).
    Sprawdza długość, format (tylko cyfry) oraz sumę kontrolną.
    
    Args:
        nip: Numer NIP w formie ciągu znaków (może zawierać myślniki, które zostaną usunięte).
        
    Returns:
        True jeśli NIP jest prawidłowy, False w przeciwnym wypadku.
    """
    # Remove any separators
    nip = nip.replace("-", "").replace(" ", "")
    
    # Check length and if it contains only digits
    if len(nip) != 10 or not nip.isdigit():
        return False
        
    # Validation weights for NIP
    weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
    
    # Calculate sum
    checksum = sum(int(nip[i]) * weights[i] for i in range(9))
    
    # Check if modulo 11 equals the control digit
    control_digit = checksum % 11
    
    # Control digit cannot be 10 (such NIPs are not issued)
    if control_digit == 10:
        return False
        
    return control_digit == int(nip[9])
