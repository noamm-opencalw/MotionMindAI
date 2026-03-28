import os
from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")

# Set for SerperDevTool auto-detection
if SERPER_API_KEY:
    os.environ["SERPER_API_KEY"] = SERPER_API_KEY


def get_llm(api_key: str | None = None, temperature: float = 0.7) -> LLM:
    """Create a Gemini LLM instance. Accepts per-request API key override."""
    key = api_key or GEMINI_API_KEY
    return LLM(
        model="gemini/gemini-2.5-flash-lite",
        api_key=key,
        temperature=temperature,
    )
