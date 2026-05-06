import os
from io import BytesIO
from pathlib import Path

import qrcode
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pytorch_grad_cam.utils.image import show_cam_on_image
from PIL import Image

from token_gen import generate_token
from resnet import get_resnet34
from resnet.trainer import get_transforms

path_to_model = Path('./model/resnet34.pth')

model = get_resnet34()
model.load(path_to_model, "cpu")

transforms = get_transforms()

load_dotenv("../.env")

labels = os.environ["LABELS"].split(",")

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
def predict(file: UploadFile) -> dict:
    img = Image.open(file.file).convert("RGB")
    x = transforms(img)
    pred = model.predict(x.unsqueeze(0))

    return {
        "label": labels[int(pred.argmax().item())],
        "target": pred.argmax().item(),
        "probs": pred.squeeze().tolist()
    }

@app.post("/gradcam")
def gradcam(file: UploadFile, target: int):
    img = Image.open(file.file).convert("RGB")
    x = transforms(img)
    gradcam = model.get_gradcam(x, target=target)

    img = Image.fromarray(show_cam_on_image(
        x.permute(1, 2, 0).numpy(),
        gradcam.numpy(),
        use_rgb=True,
    ))

    buf = BytesIO()
    img.save(buf, format="JPEG", quality=95)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")
