from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    gst_number = Column(String, nullable=False)
    gst_status = Column(String, default="Verified (Demo)")
    industry = Column(String, nullable=False)
    location = Column(String, nullable=False)
    
    annual_turnover_cr = Column(Float, nullable=False)
    experience_years = Column(Integer, nullable=False)
    company_age_years = Column(Integer, default=5)
    
    capabilities = Column(JSON, default=list) # e.g. ["Cybersecurity", "SOC", "SIEM", "VAPT"]
    certifications = Column(JSON, default=list) # e.g. ["ISO 9001", "ISO 27001", "CMMI Level 3"]
    
    # Analytics / Performance summary
    total_bids_submitted = Column(Integer, default=0)
    successful_bids = Column(Integer, default=0)
    compliance_rate = Column(Float, default=95.0)

    # Relationships
    bids = relationship("Bid", back_populates="company", cascade="all, delete-orphan")
    documents = relationship("CompanyDocument", back_populates="company", cascade="all, delete-orphan")

class CompanyDocument(Base):
    __tablename__ = "company_documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    doc_type = Column(String, nullable=False) # Financial Statement, GST Certificate, ISO Certificate, Experience Certificate
    filename = Column(String, nullable=False)
    status = Column(String, default="Verified") # Verified, Missing, Expired
    upload_date = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="documents")
