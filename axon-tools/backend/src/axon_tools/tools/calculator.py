from . import tool

@tool("Simple Calculator", keywords=["math", "logic", "utility"])
def calculate(operation: str, a: float, b: float) -> float:
    """
    Performs a simple calculation (add, subtract, multiply, divide).
    
    Args:
        operation: One of 'add', 'subtract', 'multiply', 'divide'.
        a: First number.
        b: Second number.
    """
    if operation == "add":
        return a + b
    elif operation == "subtract":
        return a - b
    elif operation == "multiply":
        return a * b
    elif operation == "divide":
        if b == 0:
            raise ValueError("Division by zero is not allowed.")
        return a / b
    
    raise ValueError(f"Unknown operation: '{operation}'. Supported: add, subtract, multiply, divide.")
