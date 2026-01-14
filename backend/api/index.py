# backend/api/index.py
# Vercel serverless entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Import routers
from app.api.journal import router as journal_router 
from app.api.habits import router as habits_router 
from app.api.insights import router as insights_router
from app.api.health import router as health_router
from app.api.stats import router as stats_router
from app.api.auth import router as auth_router
from app.api.parse import router as parse_router
from app.api.correlations import router as correlations_router

# Create FastAPI app without lifespan (Vercel doesn't support it well)
app = FastAPI(title="Evosan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register routers
app.include_router(journal_router, prefix="/journal", tags=["Journal"])
app.include_router(habits_router, prefix="/habits", tags=["Habits"])
app.include_router(insights_router, prefix="/insights", tags=["Insights"])
app.include_router(health_router, prefix="/health", tags=["Health"])
app.include_router(stats_router, prefix="/stats", tags=["Stats"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(parse_router, prefix="/parse", tags=["Parse"])
app.include_router(correlations_router, prefix="/correlations", tags=["Correlations"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Evosan API", "status": "System Operational"}

# Mangum handler for Vercel
handler = Mangum(app)
