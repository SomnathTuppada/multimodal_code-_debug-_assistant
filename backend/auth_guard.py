from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt
from dotenv import load_dotenv
import os

load_dotenv("../env")

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO = "HS256"

def require_auth(token=Depends(security)):
    try:
        payload = jwt.decode(
            token.credentials,
            JWT_SECRET,
            algorithms=[JWT_ALGO],
        )
        return payload

    except Exception as e:
        print("JWT DECODE ERROR:", repr(e))  # 🔥 IMPORTANT
        raise HTTPException(status_code=401, detail="Invalid token")
