#backend\app\main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import connect_to_mongo,close_mongo_connection

# Import 

# Lifespan events replace the old startup/shutdown events

@asynccontextmanager
async def lifespan(app:FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="Evosan API",lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers =["*"]
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Evosan API", "status": "System Operational"}