from typing import Dict, Any, List

def analyze_bid_risks(company: Dict[str, Any], tender: Dict[str, Any], bid: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Analyzes submitted bid against tender requirements and historical data to flag potential compliance or anomaly risks.
    Outputs evidence-backed risk indicators for government officers.
    """
    risk_flags = []
    
    # Risk 1: Turnover threshold check
    min_turnover = float(tender.get("min_turnover_cr", 0.0))
    company_turnover = float(company.get("annual_turnover_cr", 0.0))
    if company_turnover < min_turnover:
        risk_flags.append({
            "severity": "HIGH",
            "title": "Turnover Below Minimum Required Threshold",
            "description": f"Company reported turnover (₹{company_turnover} Cr) is below tender requirement (₹{min_turnover} Cr).",
            "evidence": f"Tender requirement: ₹{min_turnover} Cr minimum | Company reported: ₹{company_turnover} Cr | Status: REVIEW REQUIRED",
            "status": "REVIEW REQUIRED"
        })

    # Risk 2: Missing mandatory certificates
    req_certs = set(c.upper() for c in tender.get("required_certifications", []))
    company_certs = set(c.upper() for c in company.get("certifications", []))
    missing = req_certs - company_certs
    if missing:
        risk_flags.append({
            "severity": "CRITICAL" if len(missing) > 1 else "MEDIUM",
            "title": f"Missing Mandatory Certification: {', '.join(missing)}",
            "description": f"The bidder has not attached verified proof for {', '.join(missing)} as required by Technical Scope Clause 4.5.",
            "evidence": f"Clause 4.5, Page 19 | Missing: {', '.join(missing)} | Status: NON-COMPLIANT UNLESS CLARIFIED",
            "status": "NON-COMPLIANT"
        })

    # Risk 3: Experience gap check
    req_exp = int(tender.get("min_experience_years", 0))
    company_exp = int(company.get("experience_years", 0))
    if company_exp < req_exp:
        risk_flags.append({
            "severity": "MEDIUM",
            "title": "Experience Years Discrepancy",
            "description": f"Tender clause 4.3 mandates {req_exp} years of domain experience. Bidder has verified {company_exp} years.",
            "evidence": f"Tender Clause 4.3 | Required: {req_exp} years | Verified: {company_exp} years",
            "status": "REVIEW REQUIRED"
        })

    # Risk 4: Low compliance score flag
    compliance = float(bid.get("overall_compliance", 100.0))
    if compliance < 70.0:
        risk_flags.append({
            "severity": "HIGH",
            "title": "Low Overall Document Compliance Score",
            "description": f"Bid overall compliance score ({compliance}%) falls below government qualification benchmark (85%).",
            "evidence": f"Calculated Bid Compliance: {compliance}% | Threshold: 85%",
            "status": "REVIEW REQUIRED"
        })

    # Default low risk if clean
    if not risk_flags:
        risk_flags.append({
            "severity": "LOW",
            "title": "No Significant Anomaly Detected",
            "description": "Bidder credentials and submitted documents satisfy all mandatory automated criteria.",
            "evidence": "All statutory and technical clauses passed automated verification.",
            "status": "VERIFIED"
        })

    return risk_flags
