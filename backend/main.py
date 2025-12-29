import os
from dotenv import load_dotenv
load_dotenv()  # ✅ NO path, let dotenv auto-detect

from typing import Optional

from fastapi import FastAPI, Depends, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from backend.orchestrator import run_pipeline
from backend.auth_guard import require_auth
from backend.auth import router as auth_router


# ----------------------------------
# APP
# ----------------------------------
app = FastAPI(
    title="Agentic Debug Assistant",
    version="0.2.0"
)

# ----------------------------------
# MIDDLEWARE
# ----------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key="super-session-secret-key"
)

# ----------------------------------
# AUTH ROUTES
# ----------------------------------
app.include_router(auth_router, prefix="/auth")

# ----------------------------------
# HEALTH
# ----------------------------------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ----------------------------------
# ANALYZE
# ----------------------------------
@app.post("/analyze")
async def analyze(
    code: str = Form(""),
    logs: str = Form(""),
    image: Optional[UploadFile] = File(None),
    user=Depends(require_auth)
):
    print("🔍 CODE RECEIVED:", code[:100])
    print("🔍 LOGS RECEIVED:", logs)
    print("🔍 IMAGE RECEIVED:", bool(image))

    image_bytes = await image.read() if image else None

    result = run_pipeline(
        code=code,
        logs=logs,
        image=image_bytes
    )

    return {
        "error_summary": result["error_summary"],
        "error_type": result["error_type"],
        "severity": result["severity"],
        "fixed_code": result["fixed_code"],
        "explanation": result["explanation"]
    }

@app.get("/me")
def get_me(user=Depends(require_auth)):
    return {
        "email": user["email"],
        "name": user.get("name"),
        "picture": user.get("picture")
    }
