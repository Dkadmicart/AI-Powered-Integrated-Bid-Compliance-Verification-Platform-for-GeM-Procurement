from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.tender import Tender, TenderSection
from app.services.rag import answer_tender_question

router = APIRouter(tags=["copilot"])

class CopilotQueryRequest(BaseModel):
    query: str

@router.post("/tenders/{id}/chat")
def copilot_chat(id: str, req: CopilotQueryRequest, db: Session = Depends(get_db)):
    tender = db.query(Tender).filter(Tender.id == id).first()
    if not tender:
        # Fallback demo tender dict if id is generic
        tender_dict = {
            "id": id,
            "min_turnover_cr": 5.0,
            "min_experience_years": 5,
            "emd_amount": "₹5,00,000 / Exempted for MSME",
            "payment_terms": "Quarterly milestone-based payments upon successful delivery and SLA report approval.",
            "technical_capabilities": ["SOC", "SIEM", "VAPT"]
        }
        sections = []
    else:
        tender_dict = {
            "id": tender.id,
            "title": tender.title,
            "min_turnover_cr": tender.min_turnover_cr,
            "min_experience_years": tender.min_experience_years,
            "emd_amount": tender.emd_amount,
            "payment_terms": tender.payment_terms,
            "technical_capabilities": tender.technical_capabilities or []
        }
        db_sections = db.query(TenderSection).filter(TenderSection.tender_id == id).all()
        sections = [{"section_name": s.section_name, "page_number": s.page_number, "content": s.content} for s in db_sections]

    response = answer_tender_question(req.query, tender_dict, sections)
    return response
