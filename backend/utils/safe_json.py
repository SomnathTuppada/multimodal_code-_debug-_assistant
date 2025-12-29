import json
import re

def safe_parse_json(text: str, fallback: dict) -> dict:
    """
    Extracts JSON from LLM output safely.
    If parsing fails, returns fallback.
    """
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return fallback
        return json.loads(match.group())
    except Exception:
        return fallback
