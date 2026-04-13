import logging
from typing import List, Dict, Any, Optional
from datasets import Dataset

try:
    from ragas.metrics import (
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    )
    from ragas import evaluate
    RAGAS_AVAILABLE = True
except ImportError:
    RAGAS_AVAILABLE = False

logger = logging.getLogger(__name__)

class RagasEvaluator:
    """
    Evaluator for RAG quality using Ragas metrics.
    Matches the user-provided snippet logic.
    """
    
    def __init__(self, llm_adapter: Any = None):
        self.llm_adapter = llm_adapter

    async def evaluate_qa(
        self, 
        question: str, 
        answer: str, 
        contexts: List[str],
        ground_truth: Optional[str] = None
    ) -> Dict[str, float]:
        """
        Evaluate a single QA pair using Ragas.
        """
        if not RAGAS_AVAILABLE:
            logger.warning("Ragas library not installed. Evaluation skipped.")
            return {}

        # Construct Dataset (Logic from snippet)
        data_dict = {
            "question": [question],
            "answer": [answer],
            "contexts": [contexts],
        }
        
        if ground_truth:
            data_dict["ground_truth"] = [ground_truth]
            
        dataset = Dataset.from_dict(data_dict)

        try:
            # We use the provided adapter to get the LLM for evaluation if needed
            # Ragas evaluate usually takes an LLM for some metrics
            
            metrics = [
                faithfulness,
                answer_relevancy,
                context_precision,
                context_recall
            ]
            
            # Note: evaluate is often synchronous or uses its own async loop
            results = evaluate(
                dataset,
                metrics=metrics
            )
            
            return {k: float(v) for k, v in results.items()}
        except Exception as e:
            logger.error(f"Ragas evaluation failed: {e}")
            return {}

    def format_results(self, results: Dict[str, float]) -> str:
        """
        Format Ragas results for UI/Logs (Logic from snippet).
        """
        if not results:
            return "Brak danych ewaluacyjnych (RAGAS)."

        result_str = "\n📊 Self-check (RAGAS) Metrics:\n"
        for metric, score in results.items():
            result_str += f"{metric}: {score:.2f}\n"
        return result_str.strip()
