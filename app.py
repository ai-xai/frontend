import os
from pathlib import Path

import qrcode
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse

from token_gen import generate_token

load_dotenv("../.env")

app = FastAPI()


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
