import sys

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app:app", port=8000, reload="--dev" in sys.argv)
