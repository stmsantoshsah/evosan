#backend\app\main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import connect_to_mongo,close_mongo_connection
from app.api.habits import router as habits_router


# IMPORT THE NEW ROUTER
from app.api.journal import router as journal_router 
from app.api.habits import router as habits_router 
from app.api.insights import router as insights_router
from app.api.health import router as health_router
from app.api.stats import  router as stats_router

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
# REGISTER THE ROUTER
app.include_router(journal_router, prefix="/journal", tags=["Journal"])
app.include_router(habits_router, prefix="/habits", tags=["Habits"])
app.include_router(insights_router, prefix="/insights", tags=["Insights"])
app.include_router(health_router, prefix="/health", tags=["Health"])
app.include_router(stats_router, prefix="/stats", tags=["Stats"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Evosan API", "status": "System Operational"}