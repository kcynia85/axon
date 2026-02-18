from enum import Enum

class PatternType(str, Enum):
    PATTERN = "Pattern"
    REUSABLE_TEMPLATE = "Reusable Template"

class ProcessType(str, Enum):
    SEQUENTIAL = "Sequential"
    HIERARCHICAL = "Hierarchical"
    PARALLEL = "Parallel"
