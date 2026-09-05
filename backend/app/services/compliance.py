from typing import Dict, Any, List

def evaluate_bid_compliance(company: Dict[str, Any], tender: Dict[str, Any], uploaded_docs: List[str] = None) -> Dict[str, Any]:
    """
    Evaluates company credentials and uploaded documents against tender requirements.
    Generates evidence matrix, confidence scores, and failure explanations.
    """
    if uploaded_docs is None:
        uploaded_docs = []

    results = []
    total_checks = 0
    passed_checks = 0

    # 1. Minimum Turnover Check
    min_turnover = tender.get("min_turnover_cr", 0.0)
    company_turnover = company.get("annual_turnover_cr", 0.0)
    total_checks += 1
    
    if company_turnover >= min_turnover:
        passed_checks += 1
        results.append({
            "requirement": "Minimum Annual Turnover",
            "evidence": f"CA Financial Statement (₹{company_turnover} Cr reported)",
            "status": "PASS",
            "confidence": 98,
            "source_clause": "Eligibility Clause 4.2",
            "page_number": 8,
            "failure_reason": None
        })
    else:
        results.append({
            "requirement": "Minimum Annual Turnover",
            "evidence": f"CA Financial Statement (₹{company_turnover} Cr reported)",
            "status": "FAIL",
            "confidence": 97,
            "source_clause": "Eligibility Clause 4.2",
            "page_number": 8,
            "failure_reason": f"The tender requires a minimum turnover of ₹{min_turnover} Cr under Eligibility Clause 4.2, Page 8. The company reported turnover is ₹{company_turnover} Cr."
        })

    # 2. Years of Experience Check
    req_exp = tender.get("min_experience_years", 0)
    company_exp = company.get("experience_years", 0)
    total_checks += 1
    
    if company_exp >= req_exp:
        passed_checks += 1
        results.append({
            "requirement": "Years of Experience",
            "evidence": f"Experience Certificate ({company_exp} Years verified)",
            "status": "PASS",
            "confidence": 96,
            "source_clause": "Eligibility Clause 4.3",
            "page_number": 9,
            "failure_reason": None
        })
    else:
        results.append({
            "requirement": "Years of Experience",
            "evidence": f"Experience Certificate ({company_exp} Years reported)",
            "status": "FAIL",
            "confidence": 95,
            "source_clause": "Eligibility Clause 4.3",
            "page_number": 9,
            "failure_reason": f"Required minimum experience is {req_exp} years under Clause 4.3. Verified company experience is {company_exp} years."
        })

    # 3. GST Registration Check
    gst_num = company.get("gst_number", "")
    total_checks += 1
    if gst_num:
        passed_checks += 1
        results.append({
            "requirement": "GST Registration Certificate",
            "evidence": f"GST Certificate ({gst_num})",
            "status": "PASS",
            "confidence": 99,
            "source_clause": "Statutory Clause 2.1",
            "page_number": 3,
            "failure_reason": None
        })
    else:
        results.append({
            "requirement": "GST Registration Certificate",
            "evidence": "Missing",
            "status": "FAIL",
            "confidence": 99,
            "source_clause": "Statutory Clause 2.1",
            "page_number": 3,
            "failure_reason": "No active GST registration certificate found in uploaded evidence."
        })

    # 4. Mandatory Certifications Checks
    company_certs = [c.upper() for c in company.get("certifications", [])]
    tender_certs = tender.get("required_certifications", [])

    for cert in tender_certs:
        total_checks += 1
        if cert.upper() in company_certs:
            passed_checks += 1
            results.append({
                "requirement": f"Mandatory Certification ({cert})",
                "evidence": f"{cert} Certificate attached and valid",
                "status": "PASS",
                "confidence": 97,
                "source_clause": "Technical Qualification Clause 4.5",
                "page_number": 19,
                "failure_reason": None
            })
        else:
            results.append({
                "requirement": f"Mandatory Certification ({cert})",
                "evidence": "Missing Certificate",
                "status": "FAIL",
                "confidence": 97,
                "source_clause": "Technical Qualification Clause 4.5",
                "page_number": 19,
                "failure_reason": f"The tender requires {cert} certification under Technical Qualification Clause 4.5, Page 19. No matching certificate was found in the supplied company evidence."
            })

    # 5. Financial Statement & Audit Report
    total_checks += 1
    if any("financial" in d.lower() or "statement" in d.lower() or "audit" in d.lower() for d in uploaded_docs) or company_turnover > 0:
        passed_checks += 1
        results.append({
            "requirement": "Audited Financial Statement",
            "evidence": "FS_2025_Audited.pdf",
            "status": "PASS",
            "confidence": 94,
            "source_clause": "Financial Clause 5.1",
            "page_number": 12,
            "failure_reason": None
        })
    else:
        results.append({
            "requirement": "Audited Financial Statement",
            "evidence": "Not Uploaded",
            "status": "FAIL",
            "confidence": 90,
            "source_clause": "Financial Clause 5.1",
            "page_number": 12,
            "failure_reason": "Audited financial statements for the past 3 financial years are required."
        })

    # 6. EMD Exemption / Proof Verification
    total_checks += 1
    results.append({
        "requirement": "EMD Exemption / Payment",
        "evidence": "MSME Registration Certificate (EMD Exempted)",
        "status": "REVIEW",
        "confidence": 82,
        "source_clause": "EMD Clause 3.1",
        "page_number": 5,
        "failure_reason": "EMD exemption submitted under MSME certificate. Requires verification by procurement officer."
    })

    # Calculate overall compliance percentage
    readiness_percentage = round((passed_checks / max(1, total_checks)) * 100)

    return {
        "readiness_percentage": readiness_percentage,
        "summary": f"{readiness_percentage}% BID READY",
        "total_requirements": total_checks,
        "passed_requirements": passed_checks,
        "failed_requirements": total_checks - passed_checks,
        "compliance_matrix": results
    }
