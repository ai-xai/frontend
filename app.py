import os
from datetime import datetime
from io import BytesIO
from pathlib import Path

import qrcode
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
from pytorch_grad_cam.utils.image import show_cam_on_image
from resnet import get_resnet34
from resnet.trainer import get_transforms
from token_gen import generate_token, validate_token

load_dotenv()

app = FastAPI()
api = APIRouter(prefix="/api/v1")
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SECRET = os.environ["SECRET"].encode()
FRONTEND_URL = os.environ["URL"]
LABELS = os.environ["LABELS"].split(",")

UPLOAD_PATH = Path("./img")
UPLOAD_PATH.mkdir(exist_ok=True)
IMAGE_TTL = 7 * 24 * 3600

uploaded_images: dict[str, float] = {
    str(image): datetime.now().timestamp() for image in UPLOAD_PATH.iterdir()
}

path_to_model = Path("./model/resnet34.pth")

model = get_resnet34()
model.load(path_to_model, "cpu")

transforms = get_transforms()


# ---------- prediction -----------
@api.post("/predict")
def predict(file: UploadFile) -> dict:
    img = Image.open(file.file).convert("RGB")
    x = transforms(img)
    pred = model.predict(x.unsqueeze(0))

    return {
        "label": LABELS[int(pred.argmax().item())],
        "target": pred.argmax().item(),
        "probs": pred.squeeze().tolist(),
    }


@api.post("/gradcam")
def gradcam(file: UploadFile, target: int):
    img = Image.open(file.file).convert("RGB")
    x = transforms(img)
    gradcam = model.get_gradcam(x, target=target)

    img = Image.fromarray(
        show_cam_on_image(
            x.permute(1, 2, 0).numpy(),
            gradcam.numpy(),
            use_rgb=True,
        )
    )

    buf = BytesIO()
    img.save(buf, format="JPEG", quality=95)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")


# ---------- gallery -----------
@api.get("/images")
def images(image: str | None = None) -> dict:
    if image is not None:
        path = Path(image)
        if not path.exists():
            raise HTTPException(status_code=404, detail="Image not found")

        return FileResponse(path, media_type="image/jpeg")

    for image, timestamp in uploaded_images.copy().items():
        if datetime.now().timestamp() - timestamp > IMAGE_TTL:
            del uploaded_images[image]
            Path(image).unlink(missing_ok=True)

    return {"images": uploaded_images}


# ---------- upload -----------
@api.get("/upload-token")
def upload_token() -> dict:
    return {"token": generate_token(SECRET)}


@api.get("/qr")
def qr_code():
    token = generate_token(SECRET)
    data = f"{FRONTEND_URL}/upload/?token={token}"
    img = qrcode.make(data)

    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")


@api.post("/upload/{token}")
async def upload(token: str, file: UploadFile) -> dict:
    if not validate_token(SECRET, token):
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    content = await file.read()
    filename = file.filename or str(datetime.now())
    path = UPLOAD_PATH / filename
    with open(path, "wb") as f:
        f.write(content)

    uploaded_images[str(path)] = datetime.now().timestamp()
    return {"detail": f"File {filename!r} uploaded successfully"}


# ---------- static frontend -----------
app.mount("/", StaticFiles(directory="./static", html=True), name="frontend")
