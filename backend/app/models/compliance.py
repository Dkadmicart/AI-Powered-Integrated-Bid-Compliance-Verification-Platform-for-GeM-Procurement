from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ComplianceResult(Base):
    __tablename__ = "compliance_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bid_id = Column(String, ForeignKey("bids.id"), nullable=True)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    
    requirement = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    status = Column(String, nullable=False) # PASS / FAIL / REVIEW
    confidence = Column(Float, default=95.0)
    source_clause = Column(String, nullable=True)
    page_number = Column(Integer, default=1)
    failure_reason = Column(Text, nullable=True)

    bid = relationship("Bid", back_populates="compliance_results")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action = Column(String, nullable=False)
    performed_by = Column(String, default="SYSTEM_AI")
    details = Column(Text, nullable=False)
    bid_id = Column(String, nullable=True)
    tender_id = Column(String, nullable=True)
