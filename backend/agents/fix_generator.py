from typing import Optional

def generate_fix(
    error_summary: dict,
    classification: dict,
    image: Optional[bytes] = None
):
    msg = error_summary.get("message", "").lower()

    if "division by zero" in msg:
        return {
            "fixed_code": (
                "def divide(a, b):\n"
                "    if b == 0:\n"
                "        return 'Cannot divide by zero'\n"
                "    return a / b\n\n"
                "print(divide(10, 0))"
            ),
            "confidence": "high",
            "reason": "Added a zero-check before division"
        }

    if "nameerror" in msg:
        return {
            "fixed_code": "items = []\n# Define items before accessing it",
            "confidence": "medium",
            "reason": "The variable was used before being defined"
        }

    return {
        "fixed_code": "",
        "confidence": "low",
        "reason": "No automatic fix available"
    }
