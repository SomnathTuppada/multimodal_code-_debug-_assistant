from typing import Optional
import re

def extract_error(
    code: str,
    logs: str,
    image: Optional[bytes] = None
) -> dict:
    logs = logs.strip()

    if not logs:
        return {
            "message": "No logs provided",
            "root_cause": "The program did not output any error logs"
        }

    lower = logs.lower()

    # 🔹 COMMON PYTHON ERRORS (NO LLM NEEDED)
    if "zerodivisionerror" in lower:
        return {
            "message": "ZeroDivisionError: division by zero",
            "root_cause": "You attempted to divide a number by zero"
        }

    if "nameerror" in lower:
        match = re.search(r"nameerror: name '(.+?)' is not defined", logs, re.I)
        var = match.group(1) if match else "variable"
        return {
            "message": f"NameError: '{var}' is not defined",
            "root_cause": f"The variable '{var}' was used before being defined"
        }

    if "typeerror" in lower:
        return {
            "message": "TypeError occurred",
            "root_cause": "An operation was applied to an object of an inappropriate type"
        }

    if "syntaxerror" in lower:
        return {
            "message": "SyntaxError in code",
            "root_cause": "The code contains invalid Python syntax"
        }

    # 🔹 FALLBACK
    return {
        "message": logs.splitlines()[-1],
        "root_cause": "An unclassified runtime error occurred"
    }
