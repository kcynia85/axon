import functools
from typing import Callable, Any, Optional, List

def tool(name_or_func=None, keywords: Optional[List[str]] = None):
    """
    Standard @tool decorator for Axon Internal Tools.
    This decorator adds metadata required for the axon-tools dev environment
    and Axon agent runtime.
    """
    if callable(name_or_func):
        func = name_or_func
        name = func.__name__
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        
        wrapper.name = name
        wrapper.description = func.__doc__ or ""
        wrapper.is_crewai_tool = True
        wrapper.keywords = keywords or ["python", "synced"]
        wrapper.run = lambda *args, **kwargs: func(*args, **kwargs)
        return wrapper
    
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        
        wrapper.name = name_or_func
        wrapper.description = func.__doc__ or ""
        wrapper.is_crewai_tool = True
        wrapper.keywords = keywords or ["python", "synced"]
        wrapper.run = lambda *args, **kwargs: func(*args, **kwargs)
        return wrapper
        
    return decorator
