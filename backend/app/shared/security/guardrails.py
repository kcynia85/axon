import re
from typing import List, Dict, Any

class SecurityGuard:
    """
    Comprehensive Security Guard Layer for Prompt Injection Protection.
    Based on heuristic patterns and input analysis.
    """
    
    def __init__(self):
        self.suspicious_patterns = [
            # Basic Injection Attempts
            r"ignore.*(?:previous|above|all).*instructions?",
            r"forget.*(?:previous|above|all).*instructions?",
            r"act\s+as\s+(?:a\s+)?(?:different|new|another)",
            r"pretend\s+(?:to\s+be|you\s+are)",
            r"respond\s+as\s+(?:if\s+you\s+were|a)",
            r"system\s*:\s*",
            r"admin\s*:\s*",
            r"root\s*:\s*",
            r"developer\s*:\s*",
            
            # Context Manipulation
            r"end\s+of\s+(?:conversation|chat|context)",
            r"new\s+(?:conversation|chat|context|session)",
            r"start\s+(?:over|again|new)",
            r"reset\s+(?:conversation|chat|context)",
            
            # Information Extraction
            r"show\s+(?:me\s+)?(?:your|the)?\s*(?:prompt|instructions|system)",
            r"what\s+(?:are\s+)?(?:your|the)?\s*(?:prompt|instructions|system)",
            r"reveal\s+(?:your|the)?\s*(?:prompt|instructions|system)",
            
            # Privilege Escalation
            r"you\s+are\s+now\s+(?:a\s+)?(?:admin|root|developer)",
            r"enable\s+(?:admin|root|developer)\s+mode",
            r"switch\s+to\s+(?:admin|root|developer)\s+mode",
            
            # Social Engineering
            r"this\s+is\s+(?:an\s+)?(?:emergency|urgent|critical)",
            r"i\s+am\s+(?:your|the)\s+(?:admin|developer|owner)",
            r"by\s+the\s+way",
            r"also,?\s+(?:please\s+)?(?:ignore|forget)",
        ]
        
        self.compiled_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in self.suspicious_patterns]
    
    def detect_injection_patterns(self, text: str) -> List[str]:
        """
        Detects prompt injection patterns in the text.
        """
        detected = []
        for pattern in self.compiled_patterns:
            matches = pattern.findall(text)
            if matches:
                detected.extend(matches)
        return list(set(detected)) # Unique
    
    def preprocess_input(self, user_input: str) -> str:
        """
        Sanitize input before sending to LLM.
        """
        # Remove potentially dangerous characters but keep common punctuation
        # Adapted from user snippet (Czech/Unicode support preserved generally by \w)
        # We allow alphanumeric, whitespace, and basic punctuation.
        cleaned = re.sub(r'[^\w\s\-.,!?@#%&()\[\]]', '', user_input)
        
        # Limit length (Token Bucket protection proxy)
        if len(cleaned) > 2000:
            cleaned = cleaned[:2000] + "..."
        
        return cleaned.strip()
    
    def check_input_safety(self, user_input: str) -> Dict[str, Any]:
        """
        Comprehensive safety check.
        Returns dict with is_safe (bool) and reasons.
        """
        result = {
            "is_safe": True,
            "risk_level": "low",
            "detected_patterns": [],
            "reasons": []
        }
        
        # 1. Injection Patterns
        detected_patterns = self.detect_injection_patterns(user_input)
        if detected_patterns:
            result["detected_patterns"] = detected_patterns
            result["is_safe"] = False
            result["risk_level"] = "high"
            result["reasons"].append(f"Detected injection patterns: {detected_patterns}")
        
        # 2. Length Check
        if len(user_input) > 2500:
            result["is_safe"] = False
            result["risk_level"] = "medium"
            result["reasons"].append("Input too long (>2500 chars)")
        
        # 3. Instruction Overload Check
        instruction_words = ["please", "tell", "show", "give", "provide", "explain", "describe", "ignore"]
        instruction_count = sum(1 for word in instruction_words if word in user_input.lower())
        if instruction_count > 5:
            # Heuristic: Too many imperatives might be an attempt to override system prompt
            # We set warning but maybe not block unless it looks like injection
            result["risk_level"] = "medium"
            result["reasons"].append("Excessive instruction count")
        
        # 4. Repetitive Patterns (Flooding)
        words = user_input.split()
        if len(words) > 20 and len(words) != len(set(words)):
            # Simple repetition check
            unique_ratio = len(set(words)) / len(words)
            if unique_ratio < 0.5:
                result["risk_level"] = "medium"
                result["reasons"].append("Repetitive patterns detected")
        
        return result
