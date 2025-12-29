from typing import Optional
from backend.agents.error_extractor import extract_error
from backend.agents.error_classifier import classify_error
from backend.agents.fix_generator import generate_fix
from backend.agents.error_explanation import explain_fix

def run_pipeline(
    code: str,
    logs: str,
    image: Optional[bytes] = None
) -> dict:

    error_summary = extract_error(code, logs, image)
    classification = classify_error(error_summary, image)
    fix_obj = generate_fix(error_summary, classification, image)
    explanation = explain_fix(
        fix_obj["fixed_code"],
        fix_obj["reason"],
        image
    )

    return {
        "error_summary": error_summary,
        "error_type": classification["type"],
        "severity": classification["severity"],
        "fixed_code": fix_obj["fixed_code"],
        "explanation": explanation
    }
