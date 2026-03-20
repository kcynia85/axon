from . import tool

@tool("Simple Calculator")
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
            return 0.0
        return a / b
    return 0.0
