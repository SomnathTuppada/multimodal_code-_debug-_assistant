from typing import Optional

def classify_error(
    error_summary: dict,
    image: Optional[bytes] = None
) -> dict:
    msg = error_summary.get("message", "").lower()

    if "zero" in msg:
        return {"type": "Runtime", "severity": "High"}

    if "nameerror" in msg:
        return {"type": "Runtime", "severity": "Medium"}

    if "syntax" in msg:
        return {"type": "Syntax", "severity": "High"}

    if "typeerror" in msg:
        return {"type": "Runtime", "severity": "Medium"}

    return {"type": "Unknown", "severity": "Low"}
        