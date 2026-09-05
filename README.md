# GeM SmartBid AI

### AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement

> **Tagline:** *"Find. Understand. Comply. Procure Smarter."*

---

## 📌 Problem Statement & SIH Scope

The **Government e-Marketplace (GeM)** facilitates public procurement across thousands of government departments in India. However, both sellers (vendors) and procurement officers face major friction points:
1. **Sellers / Companies:** Difficulty discovering eligible tenders, understanding hundreds of pages of complex tender clauses, and verifying document compliance before submission to avoid disqualification.
2. **Government Officers:** Time-consuming manual verification of bid documents, financial thresholds, experience certificates, and identifying non-compliance or potential risk anomalies.

**GeM SmartBid AI** introduces an independent AI intelligence layer designed to integrate seamlessly with GeM via authorized APIs/data interfaces, automating tender matching, document RAG query resolution, evidence-based compliance verification, and risk auditing with mandatory **Human-in-the-Loop** officer controls.

> ⚠️ **Important Prototype Notice:**
> - Does **NOT** scrape or modify the live GeM website.
> - Operates on realistic synthetic/demo GeM tenders and company profiles.
> - Clearly labeled as an **“AI-assisted decision support prototype”**. Final procurement decisions remain strictly with authorized government officials.

---

## 🏗️ Architecture & Technology Stack

### System Architecture Overview
```
           +---------------------------------------------+
           |     GeM SmartBid AI Next.js Frontend        |
           | (Seller Portal & Govt Evaluation Dashboard) |
           +----------------------+----------------------+
                                  | HTTP / JSON REST
                                  v
           +---------------------------------------------+
           |            FastAPI Backend Engine           |
           +----------------------+----------------------+
                                  |
    +-----------------------------+-----------------------------+
    |                             |                             |
    v                             v                             v
+------------------+    +-------------------+    +----------------------+
| Tender Matching  |    | RAG Copilot Engine|    | Compliance Checker   |
| (Rule + TF-IDF)  |    | (Clause Citation) |    | (Evidence Matrix)    |
+------------------+    +-------------------+    +----------------------+
    |                             |                             |
    +-----------------------------+-----------------------------+
                                  |
                                  v
           +---------------------------------------------+
           |         SQLAlchemy / PostgreSQL / SQLite    |
           |      (Tenders, Companies, Bids, Audit Logs) |
           +---------------------------------------------+
```

### Tech Stack
- **Backend:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, Pydantic, scikit-learn, PyMuPDF (fitz), python-docx, openpyxl.
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Database & Cache:** PostgreSQL / SQLite (standalone zero-config fallback), Redis (optional docker cache).
- **Deployment:** Docker & Docker Compose, Vercel (Frontend), Render (Backend).

---

## 📂 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI Application Entry Point
│   │   ├── config.py                # Configuration Settings
│   │   ├── database.py              # SQLAlchemy DB setup (SQLite/PostgreSQL)
│   │   ├── seed_data.py             # Database seed script for 5 tenders & companies
│   │   ├── api/                     # REST API Routers
│   │   │   ├── tenders.py           # Tenders & Smart Search
│   │   │   ├── compliance.py        # Bid Compliance Verification
│   │   │   ├── companies.py         # Company Intelligence Profile
│   │   │   ├── government.py        # Government Evaluation & Bids
│   │   │   ├── chat.py              # Tender Copilot RAG Q&A
│   │   │   └── documents.py         # Document Upload & Parsing
│   │   ├── services/                # Core AI & Analytical Engines
│   │   │   ├── tender_ai.py         # Explainable Matching Algorithm
│   │   │   ├── rag.py               # Document RAG Q&A Service
│   │   │   ├── compliance.py        # Evidence Compliance Checker
│   │   │   ├── document_ai.py       # PDF/DOCX Text Extraction
│   │   │   ├── company_intelligence.py # Company Profile Analytics
│   │   │   └── risk_analysis.py     # Anomaly & Risk Detection
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   └── integrations/            # Placeholder API Interfaces (GeM, GST, MCA)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Landing / Dashboard
│   │   │   ├── search/page.tsx      # AI Tender Finder
│   │   │   ├── tenders/[id]/page.tsx # Tender Details & Copilot
│   │   │   ├── compliance/page.tsx  # Bid Compliance Checker
│   │   │   ├── company/page.tsx     # Company Intelligence
│   │   │   ├── government/page.tsx  # Government Evaluation
│   │   │   └── government/bids/[id]/page.tsx # Bid Audit & Officer Review
│   │   ├── components/              # UI Components
│   │   └── lib/api.ts               # API Client with Offline Fallback
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start / Local Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Run Backend Server (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate

# Install python dependencies
pip install -r requirements.txt

# Start FastAPI server (Database automatically seeds 5 GeM tenders & 5 companies on startup)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be live at: `http://localhost:8000`  
API Swagger Docs: `http://localhost:8000/docs`

### 2. Run Frontend Server (Next.js)
```bash
# Navigate to frontend directory (in another terminal)
cd frontend

# Install node dependencies
npm install

# Start Next.js development server
npm run dev
```
Frontend Web App will be live at: `http://localhost:3000`

---

## 🐳 Docker Deployment (Optional)

Run the entire full-stack platform (PostgreSQL + pgvector, Redis, Backend, Frontend) with one command:
```bash
docker-compose up --build
```

---

## 🚀 Step-by-Step SIH Live Demonstration Flow

Follow these steps for a complete SIH judge presentation:

| Step | Action | Page / Route | Key Features Demonstrated |
|---|---|---|---|
| **1** | Open Homepage | `/` | Hero title, KPI metrics, "Find Best Tenders" CTA, and prototype notice. |
| **2** | Enter Company Profile | `/search` | Industry: `Cybersecurity`, Capabilities: `SOC, SIEM, VAPT`, Turnover: `₹8 Cr`, Exp: `6 Yrs`. |
| **3** | Click "Find Best Tenders" | `/search` | System calculates explainable score (**94% Match**) with transparent breakdown & "WHY THIS TENDER?". |
| **4** | Click "View Tender" | `/tenders/TND-2026-001` | Displays Tender metadata, AI Summary, eligibility checklist, and required documents. |
| **5** | Ask **Tender Copilot** | Right panel on `/tenders/TND-2026-001` | Query: *"What is the minimum turnover?"* -> Answer: `₹5 Cr` with Clause 4.2, Page 8, Confidence 97%. |
| **6** | Click "Check Compliance" | `/compliance` | Runs compliance engine -> Returns **87% BID READY** score and evidence table. |
| **7** | Review Non-Compliance Alert | `/compliance` | Identifies 🔴 **ISO 27001 Missing** with exact clause rationale and "Upload Document" button. |
| **8** | Switch to Govt Portal | `/government` | Government Officer Dashboard showing 126 Bids, Eligible 94, Needs Review 21, and Bidder Table. |
| **9** | Select Bidder Deep Audit | `/government/bids/BID-2026-001` | Detailed audit page showing bidder history, risk indicators, and clause evidence matrix. |
| **10** | Officer Human Action | `/government/bids/BID-2026-001` | Test Human-in-the-Loop buttons (*"Approve for Further Review"*, *"Request Clarification"*) with audit log. |

---

## 📡 Key API Endpoints

- `GET /api/health` - System health status.
- `GET /api/tenders` - List tenders.
- `GET /api/tenders/{id}` - Fetch tender details & AI summary.
- `POST /api/tenders/smart-search` - Explainable tender matching algorithm.
- `POST /api/tenders/{id}/chat` - Tender Copilot RAG Q&A with clause citations.
- `POST /api/compliance/check` - Bid compliance matrix & failure explanations.
- `GET /api/companies/{id}` - Seller intelligence profile & charts.
- `GET /api/government/tenders/{id}/bids` - Government bidder comparison.
- `GET /api/government/bids/{id}` - Deep bidder audit & risk analysis.
- `POST /api/government/bids/{id}/action` - Human officer audit action & log.
- `POST /api/documents/upload` - PDF/DOCX/XLSX text extraction pipeline.

---

## 🌐 Production Deployment Steps

### Deploy Frontend to Vercel
1. Push repository to GitHub.
2. Connect repository on Vercel dashboard.
3. Set root directory to `frontend`.
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://<your-render-backend-url>/api`.
5. Deploy.

### Deploy Backend to Render
1. Create a new Web Service on Render.
2. Set root directory to `backend`.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
5. Add environment variable: `DATABASE_URL` (Managed PostgreSQL instance URL).

---

## 🔒 Security & Future GeM Integration

1. **Security:** File upload size validation (10 MB max), CORS control, sanitization of query inputs, zero frontend API key leakage.
2. **Future GeM API Integration:** Placeholder interfaces (`GemIntegration`, `GSTIntegration`, `MCAIntegration`) are provided in `backend/app/integrations/`. When official API access is granted by GeM authorities, replacing the interface methods enables live sync.
