from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.config import settings
from app.database import engine, Base
from app.seed_data import seed_database

# Import routers
from app.api.tenders import router as tenders_router
from app.api.compliance import router as compliance_router
from app.api.companies import router as companies_router
from app.api.government import router as government_router
from app.api.chat import router as chat_router
from app.api.documents import router as documents_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for prototype flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api prefix
app.include_router(tenders_router, prefix=settings.API_V1_STR)
app.include_router(compliance_router, prefix=settings.API_V1_STR)
app.include_router(companies_router, prefix=settings.API_V1_STR)
app.include_router(government_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)

from app.services.live_gem_scraper import sync_live_tenders_to_db
from app.database import SessionLocal

@app.on_event("startup")
def startup_event():
    # Initialize DB schema & sync live public tenders automatically
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Database seed notice: {e}")
        
    try:
        db = SessionLocal()
        synced = sync_live_tenders_to_db(db)
        print(f"Live Ingestion Engine: Synced {synced} live public tenders to database.")
        db.close()
    except Exception as e:
        print(f"Live sync notice: {e}")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "mode": "Live Procurement Data Ingestion",
        "live_ingestion": "ACTIVE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
