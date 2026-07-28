from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import algorithms
import chat

app = FastAPI(
    title="ML Algorithm Tutor API",
    description="Backend API for the ML Algorithm Tutor learning site.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4000",
        "http://localhost:4001",
        "http://127.0.0.1:4001",
        "http://127.0.0.1:4000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(algorithms.router, prefix="/api/algorithms", tags=["Algorithms"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])


@app.get("/")
def read_root():
    return {"message": "ML Algorithm Tutor API", "docs": "/docs"}
