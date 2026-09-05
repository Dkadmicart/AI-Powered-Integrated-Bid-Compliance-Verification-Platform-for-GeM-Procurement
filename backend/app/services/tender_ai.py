from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_tender_match(company_profile: Dict[str, Any], tender: Dict[str, Any]) -> Dict[str, Any]:
    """
    Explainable Tender Matching Engine.
    Combines rule-based eligibility with semantic TF-IDF capability matching.
    
    Weights (configurable):
    - Semantic capability similarity: 35%
    - Eligibility & Certifications: 30%
    - Financial suitability: 20%
    - Experience: 15%
    """
    reasons = []
    warnings = []

    # 1. Financial Suitability (20%)
    turnover_req = float(tender.get("min_turnover_cr", 0.0))
    company_turnover = float(company_profile.get("annual_turnover_cr", 0.0))
    
    if turnover_req <= 0:
        financial_score = 1.0
        reasons.append("✓ No minimum turnover constraint specified.")
    elif company_turnover >= turnover_req:
        financial_score = 1.0
        reasons.append(f"✓ Your turnover (₹{company_turnover} Cr) exceeds the minimum requirement (₹{turnover_req} Cr).")
    elif company_turnover >= turnover_req * 0.8:
        financial_score = 0.7
        warnings.append(f"⚠ Your turnover (₹{company_turnover} Cr) is slightly below preferred threshold (₹{turnover_req} Cr).")
    else:
        financial_score = 0.2
        warnings.append(f"🔴 Company turnover (₹{company_turnover} Cr) is below minimum required ₹{turnover_req} Cr.")

    # 2. Experience Match (15%)
    exp_req = int(tender.get("min_experience_years", 0))
    company_exp = int(company_profile.get("experience_years", 0))
    
    if exp_req <= 0:
        exp_score = 1.0
        reasons.append("✓ No minimum experience years required.")
    elif company_exp >= exp_req:
        exp_score = 1.0
        reasons.append(f"✓ Your experience ({company_exp} years) satisfies the stated requirement ({exp_req} years).")
    elif company_exp >= exp_req - 1:
        exp_score = 0.7
        warnings.append(f"⚠ Your experience ({company_exp} years) is close to the required {exp_req} years.")
    else:
        exp_score = 0.3
        warnings.append(f"🔴 Experience requirement gap: Required {exp_req} years vs your {company_exp} years.")

    # 3. Eligibility & Certifications (30%)
    required_certs = set(c.upper() for c in tender.get("required_certifications", []))
    company_certs = set(c.upper() for c in company_profile.get("certifications", []))
    
    if not required_certs:
        cert_score = 1.0
        reasons.append("✓ Mandatory certifications check: PASS (None specified).")
    else:
        matched_certs = required_certs.intersection(company_certs)
        missing_certs = required_certs - company_certs
        cert_score = len(matched_certs) / len(required_certs)
        
        if len(missing_certs) == 0:
            reasons.append(f"✓ Mandatory certifications verified: {', '.join(tender.get('required_certifications', []))}.")
        else:
            for missing in missing_certs:
                warnings.append(f"⚠ {missing} certificate is required by clause but not attached.")

    # 4. Technical / Capability Semantic Match (35%)
    company_caps = " ".join(company_profile.get("capabilities", [])) + " " + str(company_profile.get("industry", "")) + " " + str(company_profile.get("products_services", ""))
    tender_caps = " ".join(tender.get("technical_capabilities", [])) + " " + str(tender.get("description", "")) + " " + str(tender.get("title", ""))
    
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([company_caps, tender_caps])
        sim_matrix = cosine_similarity(tfidf[0:1], tfidf[1:2])
        semantic_sim = float(sim_matrix[0][0])
        # Scale score up to make it representative
        semantic_score = min(1.0, max(0.4, semantic_sim * 2.5))
    except Exception:
        semantic_score = 0.8

    if semantic_score > 0.7:
        reasons.append("✓ Your technical capabilities and industry domain closely match the scope of work.")
    else:
        warnings.append("⚠ Moderate domain alignment between company technical keywords and tender scope.")

    # Calculate Weighted Overall Score
    overall_score = round(
        (semantic_score * 0.35 + cert_score * 0.30 + financial_score * 0.20 + exp_score * 0.15) * 100
    )
    
    # Determine Status
    if financial_score >= 0.7 and exp_score >= 0.7 and cert_score >= 0.8:
        eligibility_status = "PASS"
    elif financial_score < 0.5 or exp_score < 0.5:
        eligibility_status = "FAIL"
    else:
        eligibility_status = "REVIEW"

    return {
        "overall_match_percentage": overall_score,
        "eligibility_status": eligibility_status,
        "technical_match_percentage": round(semantic_score * 100),
        "score_breakdown": {
            "semantic_relevance": 35,
            "eligibility_certifications": 30,
            "financial_suitability": 20,
            "experience_match": 15
        },
        "why_this_tender": reasons,
        "warnings": warnings
    }
