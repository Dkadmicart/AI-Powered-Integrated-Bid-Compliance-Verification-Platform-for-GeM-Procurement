"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, Sparkles, FileText, CheckCircle2, Building2, MapPin, Calendar, DollarSign, Award, Bot } from "lucide-react";
import { fetchTenderDetail } from "@/lib/api";
import TenderCopilot from "@/components/TenderCopilot";

export default function TenderDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "TND-2026-001";

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchTenderDetail(id);
        setTender(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 animate-pulse space-y-3">
        <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
        <p className="font-semibold text-xs">Loading tender specifications and indexing clauses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between text-xs">
        <Link href="/search" className="text-blue-700 hover:underline font-semibold">
          ← Back to AI Tender Finder
        </Link>
        <Link
          href="/compliance"
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Shield className="w-4 h-4 text-amber-400" />
          Check Bid Compliance
        </Link>
      </div>

      {/* Main Grid: Left Tender Details, Right Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tender Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Title Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded">
                {tender.category}
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 leading-snug">{tender.title}</h1>
              <p className="text-slate-500 text-xs font-medium">{tender.department}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tender Value</span>
                <span className="font-extrabold text-slate-900 text-sm">₹{tender.value_in_cr} Cr</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Submission Deadline</span>
                <span className="font-bold text-slate-800">{tender.deadline}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">EMD Amount</span>
                <span className="font-semibold text-emerald-700">{tender.emd_amount}</span>
              </div>
            </div>
          </div>

          {/* AI SUMMARY Section */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-sm space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              AI SUMMARY
            </h3>
            <p className="text-slate-200 text-xs leading-relaxed font-medium">
              "{tender.ai_summary || "This tender requires a cybersecurity provider capable of SOC monitoring, SIEM integration, vulnerability assessment and incident response."}"
            </p>
          </div>

          {/* Eligibility & Documents Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Eligibility Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Eligibility Criteria
              </h4>
              <ul className="space-y-2 font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>₹{tender.min_turnover_cr} Cr minimum annual turnover</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{tender.min_experience_years} years mandatory experience</span>
                </li>
                {tender.required_certifications?.map((c: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{c} Certification Required</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mandatory Documents Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Mandatory Submission Envelopes
              </h4>
              <ul className="space-y-2 font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>GST Registration Certificate</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Experience & Client Completion Certificates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>CA Certified Audited Financial Statements</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Scope & Terms */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Scope of Work & Technical Requirements</h3>
            <p className="text-slate-700 leading-relaxed">{tender.description}</p>

            {tender.evaluation_criteria && (
              <div className="pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Evaluation Method:</span>
                <p className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                  {tender.evaluation_criteria}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tender Copilot Assistant */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <TenderCopilot tenderId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
