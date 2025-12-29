import os
from dotenv import load_dotenv

load_dotenv("../env")
import os

print("🔥 AUTH GOOGLE_CLIENT_ID =", repr(os.getenv("GOOGLE_CLIENT_ID")))
print("🔥 AUTH GOOGLE_CLIENT_SECRET =", repr(os.getenv("GOOGLE_CLIENT_SECRET")))


from fastapi import APIRouter, Request
from authlib.integrations.starlette_client import OAuth
from jose import jwt
from datetime import datetime, timedelta
from fastapi.responses import RedirectResponse
import urllib.parse

frontend_url = "http://localhost:5173/auth/success"


router = APIRouter()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO = "HS256"

def create_jwt(user: dict):
    payload = {
        "sub": user["email"],
        "name": user["name"],
        "exp": datetime.utcnow() + timedelta(hours=6)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

@router.get("/login")
async def login(request: Request):
    redirect_uri = "http://localhost:8000/auth/callback"
    print("🔥 REDIRECT URI SENT =", redirect_uri)
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token["userinfo"]

    jwt_token = create_jwt({
        "email": user["email"],
        "name": user["name"]
    })

    # redirect back to frontend with token
    params = {
        "token": jwt_token,
        "name": user["name"],
        "email": user["email"],
        "picture": user["picture"]
    }

    redirect_url = frontend_url + "?" + urllib.parse.urlencode(params)
    return RedirectResponse(url=redirect_url)