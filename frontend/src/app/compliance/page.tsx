"use client";

import { useState, useEffect } from "react";
import { Shield, Upload, FileCheck, CheckCircle2, AlertTriangle, FileText, Sparkles, RefreshCw } from "lucide-react";
import { checkBidCompliance } from "@/lib/api";
import ComplianceTable, { ComplianceItem } from "@/components/ComplianceTable";

export default function CompliancePage() {
  const [form, setForm] = useState({
    tender_id: "TND-2026-001",
    company_name: "SecureGrid Technologies Pvt Ltd",
    annual_turnover_cr: 8.2,
    experience_years: 7,
    gst_number: "07AAAAA0000A1Z5",
    certifications: ["ISO 9001", "CMMI Level 3"], // Missing ISO 27001 by default to demonstrate the failure flow
    uploaded_documents: ["CA_Financial_Statement.pdf", "Experience_Certificate.pdf", "GST_Certificate.pdf"]
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const runVerification = async () => {
    setLoading(true);
    try {
      const res = await checkBidCompliance(form);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runVerification();
  }, []);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Uploading & extracting text from ${file.name}...`);
    setTimeout(() => {
      const newDocs = [...form.uploaded_documents, file.name];
      // If user uploads ISO 27001 cert, dynamically resolve the missing certificate
      let newCerts = [...form.certifications];
      if (file.name.toLowerCase().includes("27001") || file.name.toLowerCase().includes("iso")) {
        newCerts.push("ISO 27001");
      }

      setForm((prev) => ({
        ...prev,
        uploaded_documents: newDocs,
        certifications: newCerts
      }));
      setUploadStatus(`Successfully processed ${file.name}. Rerunning compliance verification...`);
      runVerification();
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">AI Bid Compliance Checker</h1>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Identify missing or non-compliant statutory and technical requirements prior to submitting your bid.
          </p>
        </div>

        <button
          onClick={runVerification}
          disabled={loading}
          className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Re-verify Bid Readiness</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Document Upload */}
        <div className="lg:col-span-4 space-y-6">
          {/* Company Inputs */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Bidder Profile & Credentials
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Annual Turnover</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.annual_turnover_cr}
                    onChange={(e) => setForm({ ...form, annual_turnover_cr: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">GST Registration Number</label>
                <input
                  type="text"
                  value={form.gst_number}
                  onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Active Certifications</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.certifications.map((c, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Document Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Upload Company Evidence</span>
              <span className="text-[10px] text-slate-400 font-mono">PDF, DOCX, XLSX</span>
            </h3>

            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-50/50 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800 text-xs">Drag and drop document files or browse</p>
              <p className="text-slate-400 text-[11px] mt-1">Supports PDF, DOCX, XLSX (Max 10 MB)</p>

              <label className="mt-4 inline-block bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors">
                Select File to Upload
                <input
                  type="file"
                  accept=".pdf,.docx,.xlsx"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadStatus && (
              <p className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 font-semibold rounded text-[11px]">
                {uploadStatus}
              </p>
            )}

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Uploaded Document Pipeline:</span>
              <ul className="space-y-1 text-[11px] text-slate-600 font-mono">
                {form.uploaded_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Score & Compliance Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {/* Readiness Gauge Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-amber-400 font-extrabold text-xs tracking-wider uppercase">
                AI Compliance Verification Output
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {result?.summary || "87% BID READY"}
              </h2>
              <p className="text-slate-300 text-xs">
                {result?.passed_requirements || 5} of {result?.total_requirements || 6} mandatory tender requirements satisfied with verified evidence.
              </p>
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-amber-400/80 bg-blue-900/80 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl font-black text-white">{result?.readiness_percentage || 87}%</span>
            </div>
          </div>

          {/* Compliance Matrix Table & Failure Callouts */}
          {result && (
            <ComplianceTable
              items={result.compliance_matrix || []}
              onUploadClick={() => {
                const element = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (element) element.click();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
