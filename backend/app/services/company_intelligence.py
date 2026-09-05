from typing import Dict, Any

def generate_company_profile_analytics(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates company intelligence analytics, bid history stats, and recommended tender categories.
    """
    turnover = company_data.get("annual_turnover_cr", 0.0)
    caps = company_data.get("capabilities", [])
    
    suitable_categories = []
    if any("cyber" in c.lower() or "soc" in c.lower() or "siem" in c.lower() for c in caps):
        suitable_categories.extend(["Cybersecurity", "Managed SOC", "VAPT & Security Audit"])
    if any("cloud" in c.lower() or "infra" in c.lower() for c in caps):
        suitable_categories.extend(["Cloud Infrastructure", "Data Center Services"])
    if any("software" in c.lower() or "ai" in c.lower() or "data" in c.lower() for c in caps):
        suitable_categories.extend(["Enterprise Software Development", "Data Analytics & AI"])

    if not suitable_categories:
        suitable_categories = ["IT Services", "Software Development", "System Integration"]

    total_bids = company_data.get("total_bids_submitted", 42)
    successful = company_data.get("successful_bids", 18)
    win_rate = round((successful / max(1, total_bids)) * 100, 1)

    return {
        "company_id": company_data.get("id"),
        "company_name": company_data.get("name"),
        "gst_status": company_data.get("gst_status", "Verified (Demo)"),
        "company_age": f"{company_data.get('company_age_years', 8)} Years",
        "annual_turnover": f"₹{turnover} Cr",
        "experience": f"{company_data.get('experience_years', 7)} Years",
        "bid_history": {
            "total_bids": total_bids,
            "successful_bids": successful,
            "win_rate_percentage": win_rate,
            "compliance_rate": f"{company_data.get('compliance_rate', 94.0)}%"
        },
        "strong_capabilities": caps,
        "suitable_tender_categories": list(set(suitable_categories)),
        "charts": {
            "bid_participation": [
                {"month": "Jan", "submitted": 4, "won": 2},
                {"month": "Feb", "submitted": 6, "won": 3},
                {"month": "Mar", "submitted": 8, "won": 4},
                {"month": "Apr", "submitted": 5, "won": 2},
                {"month": "May", "submitted": 9, "won": 4},
                {"month": "Jun", "submitted": 10, "won": 3}
            ],
            "compliance_trend": [
                {"quarter": "Q1", "rate": 91},
                {"quarter": "Q2", "rate": 93},
                {"quarter": "Q3", "rate": 95},
                {"quarter": "Q4", "rate": 97}
            ]
        }
    }
