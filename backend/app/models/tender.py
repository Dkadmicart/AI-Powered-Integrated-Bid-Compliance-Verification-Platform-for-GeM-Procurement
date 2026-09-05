from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Tender(Base):
    __tablename__ = "tenders"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    department = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    value_in_cr = Column(Float, nullable=False) # Tender value in Crore INR
    deadline = Column(String, nullable=False)
    emd_amount = Column(String, default="₹0 (Exempted for MSME)")
    
    # Core requirements
    min_turnover_cr = Column(Float, default=0.0)
    min_experience_years = Column(Integer, default=0)
    required_certifications = Column(JSON, default=list) # e.g. ["ISO 27001", "CMMI Level 3"]
    technical_capabilities = Column(JSON, default=list) # e.g. ["SOC", "SIEM", "VAPT"]
    
    description = Column(Text, nullable=False)
    evaluation_criteria = Column(Text, nullable=True)
    payment_terms = Column(Text, nullable=True)
    penalties = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sections = relationship("TenderSection", back_populates="tender", cascade="all, delete-orphan")
    requirements = relationship("TenderRequirement", back_populates="tender", cascade="all, delete-orphan")
    bids = relationship("Bid", back_populates="tender", cascade="all, delete-orphan")

class TenderSection(Base):
    __tablename__ = "tender_sections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    section_name = Column(String, nullable=False) # e.g., "Eligibility Clause 4.2"
    page_number = Column(Integer, default=1)
    content = Column(Text, nullable=False)

    tender = relationship("Tender", back_populates="sections")

class TenderRequirement(Base):
    __tablename__ = "tender_requirements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    category = Column(String, nullable=False) # Financial, Technical, Experience, Document, Certificate
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    mandatory = Column(String, default="YES") # YES / NO
    clause_reference = Column(String, nullable=True)
    page_number = Column(Integer, default=1)

    tender = relationship("Tender", back_populates="requirements")
