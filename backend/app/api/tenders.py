from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from app.database import get_db
from app.models.tender import Tender, TenderSection, TenderRequirement
from app.services.tender_ai import calculate_tender_match

router = APIRouter(prefix="/tenders", tags=["tenders"])

class SmartSearchRequest(BaseModel):
    industry: Optional[str] = "IT & Cybersecurity"
    capabilities: Optional[str] = "Cybersecurity, SOC, SIEM, VAPT"
    products_services: Optional[str] = ""
    annual_turnover_cr: float = 8.0
    experience_years: int = 6
    preferred_location: Optional[str] = "New Delhi"
    min_tender_value: Optional[float] = 0.0
    max_tender_value: Optional[float] = 100.0
    certifications: Optional[str] = "ISO 27001"

from app.services.live_gem_scraper import sync_live_tenders_to_db

@router.post("/sync-live")
@router.get("/sync-live")
def trigger_live_tender_sync(db: Session = Depends(get_db)):
    """Triggers live ingestion of public tenders directly into the database."""
    count = sync_live_tenders_to_db(db)
    return {
        "status": "SUCCESS",
        "message": f"Successfully ingested {count} new live tenders from public GeM/CPPP portal.",
        "synced_count": count
    }

@router.get("")

def list_tenders(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Tender)
    if category:
        query = query.filter(Tender.category.ilike(f"%{category}%"))
    tenders = query.all()
    
    result = []
    for t in tenders:
        result.append({
            "id": t.id,
            "title": t.title,
            "department": t.department,
            "category": t.category,
            "location": t.location,
            "value_in_cr": t.value_in_cr,
            "deadline": t.deadline,
            "emd_amount": t.emd_amount,
            "min_turnover_cr": t.min_turnover_cr,
            "min_experience_years": t.min_experience_years,
            "required_certifications": t.required_certifications or [],
            "technical_capabilities": t.technical_capabilities or [],
            "description": t.description
        })
    return result

@router.get("/{id}")
def get_tender_detail(id: str, db: Session = Depends(get_db)):
    tender = db.query(Tender).filter(Tender.id == id).first()
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender {id} not found")
        
    sections = db.query(TenderSection).filter(TenderSection.tender_id == id).all()
    requirements = db.query(TenderRequirement).filter(TenderRequirement.tender_id == id).all()

    return {
        "id": tender.id,
        "title": tender.title,
        "department": tender.department,
        "category": tender.category,
        "location": tender.location,
        "value_in_cr": tender.value_in_cr,
        "deadline": tender.deadline,
        "emd_amount": tender.emd_amount,
        "min_turnover_cr": tender.min_turnover_cr,
        "min_experience_years": tender.min_experience_years,
        "required_certifications": tender.required_certifications or [],
        "technical_capabilities": tender.technical_capabilities or [],
        "description": tender.description,
        "evaluation_criteria": tender.evaluation_criteria,
        "payment_terms": tender.payment_terms,
        "penalties": tender.penalties,
        "ai_summary": f"This tender requires a provider capable of {', '.join(tender.technical_capabilities or [])} for {tender.department}. Minimum turnover required is ₹{tender.min_turnover_cr} Cr with {tender.min_experience_years} years experience.",
        "requirements": [
            {
                "id": r.id,
                "category": r.category,
                "title": r.title,
                "description": r.description,
                "mandatory": r.mandatory,
                "clause_reference": r.clause_reference,
                "page_number": r.page_number
            } for r in requirements
        ],
        "sections": [
            {
                "section_name": s.section_name,
                "page_number": s.page_number,
                "content": s.content
            } for s in sections
        ]
    }

@router.post("/smart-search")
def smart_search_tenders(req: SmartSearchRequest, db: Session = Depends(get_db)):
    tenders = db.query(Tender).all()
    
    cap_list = [c.strip() for c in req.capabilities.split(",") if c.strip()]
    cert_list = [c.strip() for c in req.certifications.split(",") if c.strip()]

    company_profile = {
        "industry": req.industry,
        "capabilities": cap_list,
        "products_services": req.products_services,
        "annual_turnover_cr": req.annual_turnover_cr,
        "experience_years": req.experience_years,
        "location": req.preferred_location,
        "certifications": cert_list
    }

    matched_results = []
    for t in tenders:
        tender_dict = {
            "id": t.id,
            "title": t.title,
            "department": t.department,
            "category": t.category,
            "description": t.description,
            "min_turnover_cr": t.min_turnover_cr,
            "min_experience_years": t.min_experience_years,
            "required_certifications": t.required_certifications or [],
            "technical_capabilities": t.technical_capabilities or []
        }
        
        match_info = calculate_tender_match(company_profile, tender_dict)
        
        matched_results.append({
            "tender": {
                "id": t.id,
                "title": t.title,
                "department": t.department,
                "category": t.category,
                "location": t.location,
                "value_in_cr": t.value_in_cr,
                "deadline": t.deadline,
                "required_documents_count": 6
            },
            "match_score": match_info["overall_match_percentage"],
            "eligibility_status": match_info["eligibility_status"],
            "technical_match": match_info["technical_match_percentage"],
            "score_breakdown": match_info["score_breakdown"],
            "why_this_tender": match_info["why_this_tender"],
            "warnings": match_info["warnings"]
        })

    # Sort tenders by match score descending
    matched_results.sort(key=lambda x: x["match_score"], reverse=True)
    return matched_results
