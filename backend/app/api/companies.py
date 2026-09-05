from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.company import Company
from app.services.company_intelligence import generate_company_profile_analytics

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/{id}")
def get_company_intelligence(id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == id).first()
    
    if not company:
        # Provide demo profile if company ID is not in DB
        company_data = {
            "id": id,
            "name": "SecureGrid Technologies Pvt Ltd",
            "gst_number": "07AAAAA0000A1Z5",
            "gst_status": "Verified (Demo)",
            "industry": "IT & Cybersecurity",
            "annual_turnover_cr": 8.2,
            "experience_years": 7,
            "company_age_years": 8,
            "capabilities": ["Cybersecurity", "SOC", "SIEM", "VAPT"],
            "certifications": ["ISO 9001", "CMMI Level 3"],
            "total_bids_submitted": 42,
            "successful_bids": 18,
            "compliance_rate": 94.0
        }
    else:
        company_data = {
            "id": company.id,
            "name": company.name,
            "gst_number": company.gst_number,
            "gst_status": company.gst_status,
            "industry": company.industry,
            "annual_turnover_cr": company.annual_turnover_cr,
            "experience_years": company.experience_years,
            "company_age_years": company.company_age_years,
            "capabilities": company.capabilities or [],
            "certifications": company.certifications or [],
            "total_bids_submitted": company.total_bids_submitted,
            "successful_bids": company.successful_bids,
            "compliance_rate": company.compliance_rate
        }

    return generate_company_profile_analytics(company_data)
