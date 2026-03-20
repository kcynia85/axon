from enum import Enum

class AgentRole(str, Enum):
    MANAGER = "MANAGER"
    RESEARCHER = "RESEARCHER"
    BUILDER = "BUILDER"
    WRITER = "WRITER"

class ModelTier(str, Enum):
    TIER_1_FAST = "TIER_1_FAST"      # e.g. Gemini 1.5 Flash
    TIER_2_EXPERT = "TIER_2_EXPERT"  # e.g. Gemini 1.5 Pro, GPT-4o
