import inngest
import httpx
from bs4 import BeautifulSoup
import traceback
from typing import Optional, Dict, Any
from app.shared.infrastructure.inngest_client import inngest_client
from app.modules.settings.dependencies import get_settings_service
from app.modules.settings.application.service import SettingsService
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.shared.infrastructure.database import get_db

async def extract_pricing_data(provider_url: str, strategy: str) -> Optional[Dict[str, Dict[str, float]]]:
    """
    Algorytmiczna logika parsera oparta na wybranej strategii.
    Zwraca: Dict mapujący model_id -> {"input": X.X, "output": Y.Y}
    (wszystkie ceny za 1M tokenów).
    """
    try:
        # 1. LiteLLM Fallback / Uniwersalne źródło danych
        if strategy == "litellm_fallback" or strategy == "auto":
            async with httpx.AsyncClient() as client:
                res = await client.get("https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json", timeout=10.0)
                res.raise_for_status()
                data = res.json()
                
                prices = {}
                for k, v in data.items():
                    if isinstance(v, dict):
                        inp = v.get("input_cost_per_token", 0.0)
                        outp = v.get("output_cost_per_token", 0.0)
                        if isinstance(inp, (int, float)) and isinstance(outp, (int, float)):
                            prices[k] = {
                                "input": inp * 1_000_000,
                                "output": outp * 1_000_000
                            }
                return prices

        # 2. Proste scrapowanie tabel HTML (np. Anthropic, DeepSeek itp.)
        if strategy == "anthropic_table" or strategy == "table":
            async with httpx.AsyncClient() as client:
                res = await client.get(provider_url, timeout=10.0)
                res.raise_for_status()
                soup = BeautifulSoup(res.text, "html.parser")
                
                prices = {}
                for table in soup.find_all("table"):
                    rows = table.find_all("tr")
                    if not rows: continue
                    headers = [h.text.lower() for h in rows[0].find_all(["th", "td"])]
                    
                    model_idx, in_idx, out_idx = -1, -1, -1
                    for i, h in enumerate(headers):
                        if "model" in h: model_idx = i
                        elif "input" in h or "prompt" in h: in_idx = i
                        elif "output" in h or "completion" in h or "sampled" in h: out_idx = i
                        
                    if model_idx >= 0 and in_idx >= 0 and out_idx >= 0:
                        for row in rows[1:]:
                            cols = row.find_all("td")
                            if len(cols) > max(model_idx, in_idx, out_idx):
                                model_name = cols[model_idx].text.strip().lower()
                                in_val = cols[in_idx].text.strip().replace("$", "").replace(",", "")
                                out_val = cols[out_idx].text.strip().replace("$", "").replace(",", "")
                                try:
                                    in_float = float(in_val)
                                    out_float = float(out_val)
                                    
                                    if "1k" in headers[in_idx] or "1k" in headers[out_idx]:
                                        in_float *= 1000
                                        out_float *= 1000
                                        
                                    prices[model_name] = {"input": in_float, "output": out_float}
                                except Exception:
                                    continue
                return prices
        
        # 3. Podejście pod OpenAI SPA
        if strategy == "openai_spa":
            async with httpx.AsyncClient() as client:
                res = await client.get(provider_url, timeout=10.0)
                res.raise_for_status()
                soup = BeautifulSoup(res.text, "html.parser")
                script = soup.find("script", id="__NEXT_DATA__")
                if script:
                    import json
                    try:
                        data = json.loads(script.string)
                        # Tu można by parsować zagnieżdżony JSON OpenAI, ale dla bezpieczeństwa robimy fallback
                    except Exception:
                        pass
            
            return await extract_pricing_data(provider_url, "litellm_fallback")

    except Exception as e:
        print(f"Błąd scrapowania dla {provider_url} ({strategy}): {e}")
        return None
        
    return None

async def sync_provider(provider_id: str):
    from app.shared.utils.time import now_utc
    async for session in get_db():
        try:
            repo = SettingsRepository(session)
            provider = await repo.get_llm_provider(provider_id)
            if not provider:
                return f"Provider {provider_id} nie odnaleziony"
                
            url = provider.pricing_page_url
            strategy = provider.pricing_scraper_strategy or "auto"
            
            if not url and strategy != "litellm_fallback":
                strategy = "litellm_fallback"
                
            prices = await extract_pricing_data(url or "", strategy)
            if not prices:
                error_msg = f"Nie wyekstrahowano cen dla {provider_id}"
                await repo.update_llm_provider(provider_id, {"pricing_sync_error": error_msg})
                return error_msg
                
            provider_data = {
                "pricing_data_cache": prices,
                "pricing_last_synced_at": now_utc(),
                "pricing_sync_error": None  # Clear previous errors on success
            }
            await repo.update_llm_provider(provider_id, provider_data)
            
            models = await repo.list_llm_models()
            updated = 0
            for model in models:
                if str(model.llm_provider_id) == provider_id:
                    matched_price = None
                    for k, v in prices.items():
                        if k.lower() in model.model_id.lower() or model.model_id.lower() in k.lower():
                            matched_price = v
                            break
                    
                    update_data = {}
                    if matched_price:
                        pricing_config = model.model_pricing_config or {}
                        pricing_config["input"] = matched_price["input"]
                        pricing_config["output"] = matched_price["output"]
                        update_data["model_pricing_config"] = pricing_config
                        update_data["is_available"] = True
                        updated += 1
                    else:
                        # Model not found in zescrapowany cennik -> mark as unavailable
                        update_data["is_available"] = False
                    
                    if update_data:
                        await repo.update_llm_model(model.id, update_data)
            
            return f"Provider {provider.provider_name} zsynchronizowany. Zaktualizowano {updated} modeli."
        except Exception as e:
            traceback.print_exc()
            error_msg = f"Błąd synchronizacji {provider_id}: {str(e)}"
            # Try to save error to DB
            try:
                repo = SettingsRepository(session)
                await repo.update_llm_provider(provider_id, {"pricing_sync_error": error_msg})
            except: pass
            return error_msg

@inngest_client.create_function(
    fn_id="sync-all-pricing",
    trigger=inngest.TriggerCron(cron="0 2 * * *")
)
async def sync_all_pricing(ctx: inngest.Context):
    """
    Zadanie Cron do codziennej synchronizacji cen wszystkich dostawców.
    """
    async for session in get_db():
        repo = SettingsRepository(session)
        providers = await repo.list_llm_providers()
        
        results = []
        for provider in providers:
            if provider.pricing_page_url or provider.pricing_scraper_strategy == "litellm_fallback":
                result = await ctx.step.run(
                    f"sync-provider-{provider.id}",
                    lambda: sync_provider(str(provider.id))
                )
                results.append(result)
                
        return {"status": "completed", "results": results}

@inngest_client.create_function(
    fn_id="sync-provider-pricing-manual",
    trigger=inngest.TriggerEvent(event="provider.pricing/sync.requested")
)
async def sync_provider_pricing_event(ctx: inngest.Context):
    """
    Synchronizacja wyzwalana zdarzeniem dla konkretnego dostawcy.
    """
    provider_id = ctx.event.data.get("provider_id")
    if not provider_id:
        return {"error": "Brak provider_id"}
        
    result = await ctx.step.run(
        "sync-provider-manual",
        lambda: sync_provider(provider_id)
    )
    
    return {"status": "completed", "result": result}
