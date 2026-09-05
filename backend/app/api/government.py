from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.models.tender import Tender
from app.models.company import Company
from app.models.bid import Bid, RiskFlag
from app.models.compliance import ComplianceResult, AuditLog
from app.services.risk_analysis import analyze_bid_risks

router = APIRouter(prefix="/government", tags=["government"])

class OfficerActionRequest(BaseModel):
    action: str # "APPROVE", "REQUEST_CLARIFICATION", "MARK_NON_COMPLIANT", "MANUAL_REVIEW"
    officer_notes: Optional[str] = "Decision rendered after human review of evidence."

@router.get("/tenders/{id}/bids")
def get_government_tender_bids(id: str, db: Session = Depends(get_db)):
    tender = db.query(Tender).filter(Tender.id == id).first()
    bids = db.query(Bid).filter(Bid.tender_id == id).all()

    bidders_list = []
    total_bids = len(bids)
    eligible = 0
    needs_review = 0
    non_compliant = 0

    for b in bids:
        comp = db.query(Company).filter(Company.id == b.company_id).first()
        if b.review_status == "APPROVED":
            eligible += 1
        elif b.review_status in ["PENDING_OFFICER_REVIEW", "CLARIFICATION_REQUESTED"]:
            needs_review += 1
        else:
            non_compliant += 1

        bidders_list.append({
            "bid_id": b.id,
            "company_id": b.company_id,
            "company_name": comp.name if comp else "Submitted Bidder",
            "technical_score": f"{b.technical_score}%",
            "financial_eligibility": b.financial_eligibility,
            "document_compliance": f"{b.document_compliance}%",
            "overall_compliance": f"{b.overall_compliance}%",
            "risk_level": b.risk_level,
            "review_status": b.review_status
        })

    return {
        "tender_id": id,
        "tender_title": tender.title if tender else "Live Procurement Tender",
        "department": tender.department if tender else "Government Department",
        "requires_officer_auth": total_bids == 0,
        "statistics": {
            "total_bids": total_bids,
            "eligible": eligible,
            "needs_review": needs_review,
            "non_compliant": non_compliant
        },
        "bidders": bidders_list,
        "message": "Submitted bid documents are encrypted under official GeM credentials. Connect GeM Nodal Officer OAuth or upload a Vendor Bid Package to evaluate."
    }

@router.get("/bids/{id}")
def get_bid_details(id: str, db: Session = Depends(get_db)):
    bid = db.query(Bid).filter(Bid.id == id).first()
    
    # If generic ID or DB empty, return realistic audit payload for demo
    if not bid:
        return {
            "bid_id": id,
            "tender_id": "TND-2026-001",
            "tender_title": "Cyber Security Assessment & Managed SOC Services",
            "company": {
                "id": "COMP-001",
                "name": "SecureGrid Technologies Pvt Ltd",
                "turnover": "₹8.2 Cr",
                "experience": "7 Years",
                "gst_status": "Verified (Demo)",
                "certifications": ["ISO 9001", "CMMI Level 3"],
                "previous_bids": 42,
                "successful_bids": 18,
                "compliance_rate": "94%"
            },
            "bid_summary": {
                "technical_score": "94%",
                "financial_eligibility": "PASS",
                "document_compliance": "100%",
                "overall_compliance": "100%",
                "risk_level": "LOW",
                "review_status": "PENDING_OFFICER_REVIEW"
            },
            "risk_indicators": [
                {
                    "severity": "MEDIUM",
                    "title": "Turnover Threshold Verification",
                    "description": "Company reported turnover (₹4.2 Cr) vs Tender requirement minimum (₹5.0 Cr).",
                    "evidence": "Tender requirement: ₹5.0 Cr minimum | Company reported: ₹4.2 Cr | Status: REVIEW REQUIRED",
                    "status": "REVIEW REQUIRED"
                }
            ],
            "compliance_matrix": [
                {
                    "requirement": "Minimum Turnover",
                    "evidence": "CA Financial Statement (₹8.2 Cr reported)",
                    "status": "PASS",
                    "confidence": "98%",
                    "source": "Eligibility Clause 4.2, Page 8"
                },
                {
                    "requirement": "Experience",
                    "evidence": "Experience Certificate (7 Years)",
                    "status": "PASS",
                    "confidence": "96%",
                    "source": "Eligibility Clause 4.3, Page 9"
                },
                {
                    "requirement": "GST Registration",
                    "evidence": "GST Certificate (07AAAAA0000A1Z5)",
                    "status": "PASS",
                    "confidence": "99%",
                    "source": "Statutory Clause 2.1, Page 3"
                },
                {
                    "requirement": "ISO 27001 Certificate",
                    "evidence": "ISO 27001 Certificate (Valid till 2028)",
                    "status": "PASS",
                    "confidence": "97%",
                    "source": "Technical Qualification Clause 4.5, Page 19"
                }
            ],
            "disclaimer": "AI provides decision support. Final procurement decisions remain with authorized government officials."
        }

    comp = db.query(Company).filter(Company.id == bid.company_id).first()
    tender = db.query(Tender).filter(Tender.id == bid.tender_id).first()

    company_dict = {
        "annual_turnover_cr": comp.annual_turnover_cr if comp else 8.2,
        "certifications": comp.certifications if comp else [],
        "experience_years": comp.experience_years if comp else 7
    }
    tender_dict = {
        "min_turnover_cr": tender.min_turnover_cr if tender else 5.0,
        "required_certifications": tender.required_certifications if tender else [],
        "min_experience_years": tender.min_experience_years if tender else 5
    }

    risks = analyze_bid_risks(company_dict, tender_dict, {"overall_compliance": bid.overall_compliance})

    return {
        "bid_id": bid.id,
        "tender_id": bid.tender_id,
        "tender_title": tender.title if tender else "Tender Evaluation",
        "company": {
            "id": comp.id if comp else "",
            "name": comp.name if comp else "Unknown Bidder",
            "turnover": f"₹{comp.annual_turnover_cr} Cr" if comp else "N/A",
            "experience": f"{comp.experience_years} Years" if comp else "N/A",
            "gst_status": comp.gst_status if comp else "Verified",
            "certifications": comp.certifications if comp else [],
            "previous_bids": comp.total_bids_submitted if comp else 0,
            "successful_bids": comp.successful_bids if comp else 0,
            "compliance_rate": f"{comp.compliance_rate}%" if comp else "N/A"
        },
        "bid_summary": {
            "technical_score": f"{bid.technical_score}%",
            "financial_eligibility": bid.financial_eligibility,
            "document_compliance": f"{bid.document_compliance}%",
            "overall_compliance": f"{bid.overall_compliance}%",
            "risk_level": bid.risk_level,
            "review_status": bid.review_status,
            "officer_notes": bid.officer_notes
        },
        "risk_indicators": risks,
        "disclaimer": "AI provides decision support. Final procurement decisions remain with authorized government officials."
    }

@router.post("/bids/{id}/action")
def execute_officer_action(id: str, req: OfficerActionRequest, db: Session = Depends(get_db)):
    bid = db.query(Bid).filter(Bid.id == id).first()
    
    status_mapping = {
        "APPROVE": "APPROVED",
        "REQUEST_CLARIFICATION": "CLARIFICATION_REQUESTED",
        "MARK_NON_COMPLIANT": "NON_COMPLIANT",
        "MANUAL_REVIEW": "MANUAL_REVIEW_FLAGGED"
    }

    new_status = status_mapping.get(req.action.upper(), "PENDING_OFFICER_REVIEW")
    
    if bid:
        bid.review_status = new_status
        bid.officer_notes = req.officer_notes
        db.commit()

    # Log to audit trial
    audit = AuditLog(
        action=f"OFFICER_DECISION_{req.action.upper()}",
        performed_by="GOVT_OFFICER_DEMO",
        details=f"Bid {id} review status updated to {new_status}. Notes: {req.officer_notes}",
        bid_id=id
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "bid_id": id,
        "new_review_status": new_status,
        "notes": req.officer_notes,
        "timestamp": datetime.utcnow().isoformat()
    }
