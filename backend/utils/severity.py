def compute_severity(error_type: str) -> str:
    mapping = {
        "Syntax": "low",
        "Logical": "medium",
        "Runtime": "high",
        "Dependency": "medium"
    }
    return mapping.get(error_type, "medium")
