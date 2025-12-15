import json
from typing import Dict, Optional
from backend.app.shared.infrastructure.adk import GoogleADK

# Prompts for LLM-as-a-Judge
FAITHFULNESS_PROMPT = """
You are an expert evaluator for a RAG system.
Your task is to score the **Faithfulness** of the generated answer.

**Query:** {query}
**Retrieved Context:** {context}
**Generated Answer:** {answer}

**Criteria:**
- Score 1.0: The answer is fully supported by the Context.
- Score 0.0: The answer contradicts the Context or makes up information not present in Context.
- If the answer relies on general knowledge but doesn't contradict Context, score 0.5.

**Output Format:**
Return ONLY a JSON object with:
{{
  "score": float,
  "reasoning": "string"
}}
"""

RELEVANCE_PROMPT = """
You are an expert evaluator.
Your task is to score the **Relevance** of the generated answer.

**Query:** {query}
**Generated Answer:** {answer}

**Criteria:**
- Score 1.0: The answer directly and fully addresses the User Query.
- Score 0.0: The answer is irrelevant or ignores the User Query.

**Output Format:**
Return ONLY a JSON object with:
{{
  "score": float,
  "reasoning": "string"
}}
"""

class EvaluationService:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    async def evaluate_faithfulness(self, query: str, context: str, answer: str) -> Dict:
        prompt = FAITHFULNESS_PROMPT.format(query=query, context=context, answer=answer)
        return await self._run_eval(prompt)

    async def evaluate_relevance(self, query: str, answer: str) -> Dict:
        prompt = RELEVANCE_PROMPT.format(query=query, answer=answer)
        return await self._run_eval(prompt)

    async def _run_eval(self, prompt: str) -> Dict:
        try:
            # We use use_cache=False for evals to ensure fresh judgement
            response_text = await GoogleADK.generate_content(
                prompt=prompt, 
                model_name=self.model_name, 
                use_cache=False
            )
            
            # Clean up potential markdown code blocks
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
            
        except json.JSONDecodeError:
            print(f"Eval JSON Parse Error. Response: {response_text}")
            return {"score": 0.0, "reasoning": "Failed to parse Judge output"}
        except Exception as e:
            print(f"Eval Error: {e}")
            return {"score": 0.0, "reasoning": str(e)}
