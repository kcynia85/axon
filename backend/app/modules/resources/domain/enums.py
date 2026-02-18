from enum import Enum

class AutomationPlatform(str, Enum):
    N8N = "n8n"
    ZAPIER = "Zapier"
    MAKE = "Make"
    CUSTOM = "Custom"

class AutomationHttpMethod(str, Enum):
    POST = "POST"
    GET = "GET"
    PUT = "PUT"

class ValidationStatus(str, Enum):
    VALID = "Valid"
    INVALID = "Invalid"
    UNTESTED = "Untested"

class ServiceCategory(str, Enum):
    UTILITY = "Utility"
    GENAI = "GenAI"
    SCRAPING = "Scraping"
    BUSINESS = "Business"

class ToolCategory(str, Enum):
    PRIMEVAL = "Primeval"
    AI_UTILS = "AI_Utils"
    LOCAL = "Local"
    OTHER = "Other"

class AvailabilityWorkspace(str, Enum):
    GLOBAL = "Global"
    DISCOVERY = "Discovery"
    DESIGN = "Design"
    DELIVERY = "Delivery"
    GROWTH_MARKET = "Growth & Market"
    PRODUCT_MANAGEMENT = "Product Management"
