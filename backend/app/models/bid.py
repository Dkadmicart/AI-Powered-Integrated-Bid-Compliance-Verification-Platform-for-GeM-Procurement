from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Bid(Base):
    __tablename__ = "bids"

    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    
    technical_score = Column(Float, default=0.0)
    financial_eligibility = Column(String, default="PASS") # PASS / FAIL / REVIEW
    document_compliance = Column(Float, default=0.0) # Percentage
    overall_compliance = Column(Float, default=0.0) # Percentage
    risk_level = Column(String, default="LOW") # LOW / MEDIUM / HIGH
    review_status = Column(String, default="PENDING_OFFICER_REVIEW") # PENDING_OFFICER_REVIEW / APPROVED / CLARIFICATION_REQUESTED / NON_COMPLIANT
    
    submitted_at = Column(DateTime, default=datetime.utcnow)
    officer_notes = Column(Text, nullable=True)

    # Relationships
    tender = relationship("Tender", back_populates="bids")
    company = relationship("Company", back_populates="bids")
    compliance_results = relationship("ComplianceResult", back_populates="bid", cascade="all, delete-orphan")
    risk_flags = relationship("RiskFlag", back_populates="bid", cascade="all, delete-orphan")

class RiskFlag(Base):
    __tablename__ = "risk_flags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bid_id = Column(String, ForeignKey("bids.id"), nullable=False)
    severity = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    status = Column(String, default="REVIEW REQUIRED")

    bid = relationship("Bid", back_populates="risk_flags")
