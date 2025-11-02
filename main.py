import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import secrets

app = FastAPI()

# --- Configuración de CORS ---
# Esto permite que el frontend (React) hable con el backend (FastAPI)
origins = [
    "http://localhost:5173",  # Puerto por defecto de Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- "Base de Datos" en memoria ---
url_database = {}


# --- Modelos de Pydantic ---
class LinkCreate(BaseModel):
    long_url: str
    custom_short_code: str | None = None


class LinkUpdate(BaseModel):
    long_url: str


class LinkResponse(BaseModel):
    short_code: str
    long_url: str


# --- Endpoints del API ---
@app.post("/links", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_short_link(link: LinkCreate):
    if link.custom_short_code:
        if link.custom_short_code in url_database:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Short code already in use",
            )
        short_code = link.custom_short_code
    else:
        short_code = secrets.token_urlsafe(6)
        while short_code in url_database:
            short_code = secrets.token_urlsafe(6)

    url_database[short_code] = link.long_url
    return LinkResponse(short_code=short_code, long_url=link.long_url)


@app.get("/links", response_model=list[LinkResponse])
def get_all_links():
    return [
        LinkResponse(short_code=code, long_url=url)
        for code, url in url_database.items()
    ]


@app.put("/links/{short_code}", response_model=LinkResponse)
def update_link_destination(short_code: str, link_update: LinkUpdate):
    if short_code not in url_database:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Short code not found"
        )

    url_database[short_code] = link_update.long_url
    return LinkResponse(short_code=short_code, long_url=link_update.long_url)


# --- Endpoint de Redirección ---


@app.get("/{short_code}")
def redirect_to_long_url(short_code: str):
    long_url = url_database.get(short_code)

    if not long_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="URL not found"
        )

    return RedirectResponse(
        url=long_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT
    )


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
