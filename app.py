import os
from io import BytesIO
from pathlib import Path

import qrcode
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from PIL import Image

from token_gen import generate_token

load_dotenv("../.env")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SECRET = os.environ["SECRET"].encode()
BACKEND_URL = os.environ["URL"]


@app.get("/upload")
def upload():
    filename = Path("qrcode.png")

    data = f"{BACKEND_URL}/upload/{generate_token(SECRET)}"
    img = qrcode.make(data)

    with open(filename, "wb") as file:
        img.save(file)

    return FileResponse(filename)


@app.post("/predict")
def predict(file: UploadFile):
    img = Image.open(file.file).convert("RGB")
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=95)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")
