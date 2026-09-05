from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.tender import Tender, TenderSection, TenderRequirement
from app.models.company import Company, CompanyDocument
from app.models.bid import Bid, RiskFlag
from app.models.compliance import ComplianceResult, AuditLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(Tender).count() > 0:
        db.close()
        return

    print("Seeding database with synthetic GeM tender and company data...")

    # 1. Seed Tenders
    t1 = Tender(
        id="TND-2026-001",
        title="Cyber Security Assessment & Managed SOC Services",
        department="Ministry of Petroleum & Natural Gas",
        category="IT & Cybersecurity",
        location="New Delhi",
        value_in_cr=8.5,
        deadline="20 October 2026",
        emd_amount="₹5,00,000 / Exempted for MSME",
        min_turnover_cr=5.0,
        min_experience_years=5,
        required_certifications=["ISO 27001", "CMMI Level 3"],
        technical_capabilities=["SOC", "SIEM", "VAPT", "Cybersecurity", "Incident Response"],
        description="Comprehensive 24x7 Security Operations Center (SOC) monitoring, SIEM log correlation, vulnerability assessment and penetration testing (VAPT), and threat intelligence for ministry infrastructure.",
        evaluation_criteria="Quality and Cost Based Selection (QCBS) - 70% Technical, 30% Financial",
        payment_terms="Quarterly payments upon delivery of SOC monthly audit reports.",
        penalties="0.5% per week delay up to max 10% of contract value."
    )

    t2 = Tender(
        id="TND-2026-002",
        title="Enterprise Data Analytics & AI Platform",
        department="Ministry of Electronics & Information Technology",
        category="AI & Data Analytics",
        location="Bengaluru",
        value_in_cr=12.0,
        deadline="15 November 2026",
        emd_amount="₹10,00,000 / Exempted for MSME",
        min_turnover_cr=8.0,
        min_experience_years=6,
        required_certifications=["ISO 9001", "ISO 27001"],
        technical_capabilities=["Data Analytics", "AI", "Machine Learning", "Big Data", "Data Pipeline"],
        description="Implementation of scalable big data lakehouse, predictive analytics dashboard, and automated NLP document intelligence model.",
        evaluation_criteria="L1 Financial Bid among technically qualified bidders",
        payment_terms="Milestone based: 20% SRS, 40% Deployment, 40% Go-Live.",
        penalties="1.0% per week for milestone delays."
    )

    t3 = Tender(
        id="TND-2026-003",
        title="IoT Monitoring & Predictive Maintenance",
        department="Ministry of Heavy Industries",
        category="IoT & Automation",
        location="Pune",
        value_in_cr=4.5,
        deadline="05 December 2026",
        emd_amount="Exempted for MSME",
        min_turnover_cr=3.0,
        min_experience_years=4,
        required_certifications=["ISO 9001"],
        technical_capabilities=["IoT", "Predictive Maintenance", "Sensors", "Telemetry"],
        description="Deployment of industrial IoT telemetry sensors, edge computing gateways, and predictive equipment maintenance web application.",
        evaluation_criteria="QCBS - 60% Technical, 40% Financial",
        payment_terms="30% advance on delivery, 70% post installation.",
        penalties="0.5% per week max 5%."
    )

    t4 = Tender(
        id="TND-2026-004",
        title="Cloud Infrastructure Managed Services",
        department="National Informatics Centre (NIC)",
        category="Cloud & Data Center",
        location="Hyderabad",
        value_in_cr=15.0,
        deadline="28 October 2026",
        emd_amount="₹12,00,000",
        min_turnover_cr=10.0,
        min_experience_years=7,
        required_certifications=["ISO 27001", "ISO 20000", "MeitY Empanelled Cloud"],
        technical_capabilities=["Cloud", "DevOps", "Kubernetes", "Data Center", "DR Site"],
        description="Managed multi-cloud infrastructure, automated failover disaster recovery (DR) setup, and 99.95% uptime SLA management.",
        evaluation_criteria="QCBS - 80% Technical, 20% Financial",
        payment_terms="Monthly recurring service charges.",
        penalties="Deductions based on SLA breach thresholds."
    )

    t5 = Tender(
        id="TND-2026-005",
        title="Enterprise Software Development Services",
        department="Ministry of Rural Development",
        category="Software Development",
        location="New Delhi",
        value_in_cr=6.2,
        deadline="10 November 2026",
        emd_amount="Exempted for MSME",
        min_turnover_cr=4.0,
        min_experience_years=5,
        required_certifications=["CMMI Level 3", "ISO 9001"],
        technical_capabilities=["Software Development", "React", "Python", "PostgreSQL", "Mobile App"],
        description="End-to-end design, development, and rollout of citizen benefit delivery web and mobile applications.",
        evaluation_criteria="QCBS - 70% Technical, 30% Financial",
        payment_terms="Sprint-based quarterly payments.",
        penalties="0.5% per week delay."
    )

    db.add_all([t1, t2, t3, t4, t5])
    db.commit()

    # Tender Sections for TND-2026-001 (RAG Copilot source targets)
    sec1 = TenderSection(
        tender_id="TND-2026-001",
        section_name="Eligibility Clause 4.2",
        page_number=8,
        content="Eligibility Clause 4.2: The minimum average annual turnover of the bidder during the last three financial years (2022-23, 2023-24, 2024-25) must be at least ₹5.0 Crore. Bidders must upload CA certified audited balance sheets."
    )
    sec2 = TenderSection(
        tender_id="TND-2026-001",
        section_name="Technical Qualification Clause 4.5",
        page_number=19,
        content="Technical Qualification Clause 4.5: The bidder must hold a valid ISO 27001:2022 Information Security Management System certification as of bid submission deadline. Certificate must be issued by an NABCB/IAF accredited body."
    )
    sec3 = TenderSection(
        tender_id="TND-2026-001",
        section_name="Financial Terms Clause 3.1",
        page_number=5,
        content="Financial Terms Clause 3.1: Earnest Money Deposit (EMD) of ₹5,00,000/- is mandatory. Micro and Small Enterprises (MSEs) registered with UDYAM are exempted from EMD upon submitting valid registration certificate."
    )
    sec4 = TenderSection(
        tender_id="TND-2026-001",
        section_name="Document Submission Clause 6.1",
        page_number=14,
        content="Document Submission Clause 6.1: Mandatory documents to be submitted in Technical Envelope: 1. GST Registration 2. PAN Card 3. Last 3 Years CA Certified Financial Statements 4. ISO 27001 Certificate 5. Minimum 3 Client Experience Certificates."
    )
    db.add_all([sec1, sec2, sec3, sec4])
    db.commit()

    # 2. Seed Companies
    c1 = Company(
        id="COMP-001",
        name="SecureGrid Technologies Pvt Ltd",
        gst_number="07AAAAA0000A1Z5",
        gst_status="Verified (Demo)",
        industry="IT & Cybersecurity",
        location="New Delhi",
        annual_turnover_cr=8.2,
        experience_years=7,
        company_age_years=8,
        capabilities=["Cybersecurity", "SOC", "SIEM", "VAPT", "Incident Response"],
        certifications=["ISO 9001", "CMMI Level 3"], # Note: Missing ISO 27001 for demo compliance check flow
        total_bids_submitted=42,
        successful_bids=18,
        compliance_rate=94.0
    )

    c2 = Company(
        id="COMP-002",
        name="CyberNova Systems",
        gst_number="27BBBBB1111B1Z2",
        gst_status="Verified (Demo)",
        industry="IT & Cybersecurity",
        location="Mumbai",
        annual_turnover_cr=10.5,
        experience_years=8,
        company_age_years=10,
        capabilities=["Cybersecurity", "SOC", "SIEM", "ISO 27001 Audit"],
        certifications=["ISO 27001", "ISO 9001", "CMMI Level 3"],
        total_bids_submitted=55,
        successful_bids=26,
        compliance_rate=98.0
    )

    c3 = Company(
        id="COMP-003",
        name="DataShield Solutions",
        gst_number="09CCCCC2222C1Z8",
        gst_status="Verified (Demo)",
        industry="IT Services",
        location="Noida",
        annual_turnover_cr=4.2, # Below 5Cr requirement
        experience_years=3,
        company_age_years=4,
        capabilities=["Networking", "IT Support"],
        certifications=["ISO 9001"],
        total_bids_submitted=15,
        successful_bids=3,
        compliance_rate=72.0
    )

    c4 = Company(
        id="COMP-004",
        name="Vigilant Networks",
        gst_number="06DDDDD3333D1Z4",
        gst_status="Verified (Demo)",
        industry="IT & Cybersecurity",
        location="Gurugram",
        annual_turnover_cr=9.0,
        experience_years=6,
        company_age_years=7,
        capabilities=["SOC", "SIEM", "VAPT", "Cybersecurity"],
        certifications=["ISO 27001", "CMMI Level 3"],
        total_bids_submitted=30,
        successful_bids=12,
        compliance_rate=92.0
    )

    c5 = Company(
        id="COMP-005",
        name="Apex Cloud Systems",
        gst_number="36EEEEE4444E1Z9",
        gst_status="Verified (Demo)",
        industry="Cloud & Data Center",
        location="Hyderabad",
        annual_turnover_cr=16.0,
        experience_years=9,
        company_age_years=11,
        capabilities=["Cloud", "DevOps", "Kubernetes", "Data Center"],
        certifications=["ISO 27001", "ISO 20000", "MeitY Empanelled Cloud"],
        total_bids_submitted=64,
        successful_bids=32,
        compliance_rate=96.0
    )

    db.add_all([c1, c2, c3, c4, c5])
    db.commit()

    # 3. Seed Bids for TND-2026-001
    b1 = Bid(
        id="BID-2026-001",
        tender_id="TND-2026-001",
        company_id="COMP-001",
        technical_score=94.0,
        financial_eligibility="PASS",
        document_compliance=100.0,
        overall_compliance=100.0,
        risk_level="LOW",
        review_status="PENDING_OFFICER_REVIEW"
    )
    b2 = Bid(
        id="BID-2026-002",
        tender_id="TND-2026-001",
        company_id="COMP-002",
        technical_score=89.0,
        financial_eligibility="PASS",
        document_compliance=91.0,
        overall_compliance=90.0,
        risk_level="LOW",
        review_status="APPROVED"
    )
    b3 = Bid(
        id="BID-2026-003",
        tender_id="TND-2026-001",
        company_id="COMP-003",
        technical_score=76.0,
        financial_eligibility="FAIL",
        document_compliance=60.0,
        overall_compliance=20.0,
        risk_level="HIGH",
        review_status="NON_COMPLIANT"
    )

    db.add_all([b1, b2, b3])
    db.commit()

    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
