# This directory contains internal tools (user-defined functions)
# that are automatically scanned and synced with the application.

import functools

def tool(name_or_func=None):
    """Mock @tool decorator for Axon Internal Tools."""
    if callable(name_or_func):
        func = name_or_func
        name = func.__name__
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper.name = name
        wrapper.description = func.__doc__ or ""
        wrapper.is_crewai_tool = True
        wrapper.run = lambda *args, **kwargs: func(*args, **kwargs)
        return wrapper
    
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper.name = name_or_func
        wrapper.description = func.__doc__ or ""
        wrapper.is_crewai_tool = True
        wrapper.run = lambda *args, **kwargs: func(*args, **kwargs)
        return wrapper
    return decorator

# Example:
# @tool("My Custom Tool")
# def my_custom_tool(arg1: str) -> str:
#     """Description of what the tool does."""
#     return f"Result: {arg1}"
