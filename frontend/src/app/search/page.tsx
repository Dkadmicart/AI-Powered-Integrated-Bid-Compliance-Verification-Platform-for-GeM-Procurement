"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, Filter, CheckCircle2, AlertTriangle, ArrowRight, Building2, MapPin, Calendar, DollarSign, Award, Shield } from "lucide-react";
import { smartSearchTenders } from "@/lib/api";

export default function SearchPage() {
  const [form, setForm] = useState({
    industry: "IT & Cybersecurity",
    capabilities: "Cybersecurity, SOC, SIEM, VAPT",
    products_services: "Managed Security Operations Center, Incident Response",
    annual_turnover_cr: 8.0,
    experience_years: 6,
    preferred_location: "New Delhi",
    min_tender_value: 0,
    max_tender_value: 50,
    certifications: "ISO 27001"
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await smartSearchTenders(form);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">AI Tender Finder</h1>
        </div>
        <p className="text-slate-500 text-xs">
          Tell us about your company and we’ll identify relevant tenders using explainable AI matching.
        </p>
      </div>

      {/* Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Company Parameters</span>
            <Filter className="w-4 h-4 text-slate-400" />
          </h3>

          <div className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Industry Domain</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Technical Capabilities</label>
              <input
                type="text"
                value={form.capabilities}
                onChange={(e) => setForm({ ...form, capabilities: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                placeholder="Comma separated (e.g. SOC, SIEM, VAPT)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Annual Turnover (₹ Cr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.annual_turnover_cr}
                  onChange={(e) => setForm({ ...form, annual_turnover_cr: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={form.experience_years}
                  onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Preferred Location</label>
              <input
                type="text"
                value={form.preferred_location}
                onChange={(e) => setForm({ ...form, preferred_location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Certifications Held</label>
              <input
                type="text"
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{loading ? "Matching Tenders..." : "Find Best Tenders"}</span>
            </button>
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Matched Tenders ({results.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Configurable Matching Weights: Semantic 35% | Eligibility 30% | Financial 20% | Exp 15%
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 animate-pulse space-y-3">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
              <p className="font-semibold text-xs">Evaluating semantic suitability and financial thresholds...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((res, idx) => {
                const t = res.tender;
                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-blue-300 transition-all"
                  >
                    {/* Header Card Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <span className="bg-blue-50 text-blue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-blue-200/60 inline-block mb-1.5">
                          {t.category}
                        </span>
                        <h2 className="font-bold text-slate-900 text-base">{t.title}</h2>
                        <p className="text-slate-500 text-xs mt-0.5">{t.department}</p>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Overall Match</span>
                          <span className="text-2xl font-extrabold text-blue-900">{res.match_score}%</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="text-right text-[11px]">
                          <span className="font-bold block text-emerald-700">Eligibility: {res.eligibility_status}</span>
                          <span className="text-slate-500 font-mono">Technical: {res.technical_match}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/60 p-3 rounded-lg text-xs font-mono text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Tender Value</span>
                        <span className="font-bold text-slate-900">₹{t.value_in_cr} Cr</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Deadline</span>
                        <span className="font-semibold">{t.deadline}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Location</span>
                        <span>{t.location}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Required Documents</span>
                        <span>{t.required_documents_count} Files</span>
                      </div>
                    </div>

                    {/* WHY THIS TENDER? Section */}
                    <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-4 space-y-2 text-xs">
                      <h4 className="font-bold text-blue-950 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                        WHY THIS TENDER? (Explainable Reasoning)
                      </h4>

                      <ul className="space-y-1 text-slate-800">
                        {res.why_this_tender?.map((reason: string, rIdx: number) => (
                          <li key={rIdx} className="flex items-start gap-1.5 text-emerald-800 font-medium">
                            <span>{reason}</span>
                          </li>
                        ))}

                        {res.warnings?.map((warn: string, wIdx: number) => (
                          <li key={wIdx} className="flex items-start gap-1.5 text-amber-800 font-medium">
                            <span>{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <Link
                        href={`/tenders/${t.id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                      >
                        View Tender Details
                      </Link>

                      <Link
                        href="/compliance"
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Check Compliance
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
