from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.database import get_db
from app.models.tender import Tender
from app.models.company import Company
from app.services.compliance import evaluate_bid_compliance

router = APIRouter(prefix="/compliance", tags=["compliance"])

class ComplianceCheckRequest(BaseModel):
    tender_id: Optional[str] = "TND-2026-001"
    company_name: str = "SecureGrid Technologies"
    annual_turnover_cr: float = 8.2
    experience_years: int = 7
    gst_number: Optional[str] = "07AAAAA0000A1Z5"
    certifications: Optional[List[str]] = ["ISO 9001", "CMMI Level 3"] # Missing ISO 27001 by default for demo flow
    uploaded_documents: Optional[List[str]] = ["CA_Financial_Statement.pdf", "Experience_Certificate.pdf", "GST_Certificate.pdf"]

@router.post("/check")
def check_compliance(req: ComplianceCheckRequest, db: Session = Depends(get_db)):
    tender = db.query(Tender).filter(Tender.id == req.tender_id).first()
    
    tender_dict = {
        "id": req.tender_id,
        "min_turnover_cr": tender.min_turnover_cr if tender else 5.0,
        "min_experience_years": tender.min_experience_years if tender else 5,
        "required_certifications": tender.required_certifications if tender else ["ISO 27001", "CMMI Level 3"]
    }
    
    company_dict = {
        "name": req.company_name,
        "annual_turnover_cr": req.annual_turnover_cr,
        "experience_years": req.experience_years,
        "gst_number": req.gst_number,
        "certifications": req.certifications or []
    }

    result = evaluate_bid_compliance(company_dict, tender_dict, req.uploaded_documents or [])
    return result
