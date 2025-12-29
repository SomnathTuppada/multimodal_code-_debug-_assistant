from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    code: str
    logs: str
    language: str

class ErrorDetails(BaseModel):
    message: str
    root_cause: str

class AnalyzeResponse(BaseModel):
    error_summary: ErrorDetails
    error_type: str
    severity: str
    fixed_code: str
    explanation: str
