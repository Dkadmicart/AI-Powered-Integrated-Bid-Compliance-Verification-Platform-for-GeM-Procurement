"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, AlertTriangle, CheckCircle2, XCircle, FileText, Landmark, UserCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { fetchBidDetails } from "@/lib/api";
import HumanReviewPanel from "@/components/HumanReviewPanel";

export default function BidAuditDetailPage() {
  const params = useParams();
  const bidId = (params?.id as string) || "BID-2026-001";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBid = async () => {
    try {
      const res = await fetchBidDetails(bidId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBid();
  }, [bidId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 animate-pulse space-y-3">
        <Landmark className="w-8 h-8 text-blue-900 mx-auto animate-spin" />
        <p className="font-semibold text-xs">Performing deep evidence audit & risk flag analysis...</p>
      </div>
    );
  }

  const company = data?.company || {};
  const summary = data?.bid_summary || {};
  const risks = data?.risk_indicators || [];
  const matrix = data?.compliance_matrix || [];

  return (
    <div className="space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs">
        <Link href="/government" className="text-blue-700 hover:underline font-semibold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Government Evaluation Dashboard
        </Link>
        <span className="font-mono text-slate-500">Audit Reference: {bidId}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
              Bid Audit Report
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{company.name}</h1>
            <p className="text-slate-500 text-xs mt-0.5">Tender: {data?.tender_title}</p>
          </div>

          {/* Overall Scores Summary */}
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Tech Score</span>
              <span className="text-xl font-extrabold text-slate-900">{summary.technical_score}</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Financial</span>
              <span className="text-xs font-bold text-emerald-700">{summary.financial_eligibility}</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Compliance</span>
              <span className="text-xl font-extrabold text-blue-900">{summary.overall_compliance}</span>
            </div>
          </div>
        </div>

        {/* Company Quick Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Reported Turnover</span>
            <span className="font-bold">{company.turnover}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Verified Experience</span>
            <span className="font-bold">{company.experience}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">GST Verification</span>
            <span className="text-emerald-700 font-semibold">{company.gst_status}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Bid History Win Rate</span>
            <span className="font-bold">{company.compliance_rate}</span>
          </div>
        </div>
      </div>

      {/* Risk Indicators Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          AI Risk Indicators & Anomaly Alerts ({risks.length})
        </h3>

        <div className="space-y-3">
          {risks.map((risk: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-l-4 shadow-2xs space-y-2 text-xs ${
                risk.severity === "HIGH" || risk.severity === "CRITICAL"
                  ? "bg-rose-50 border-rose-600 text-rose-900"
                  : "bg-amber-50 border-amber-500 text-amber-950"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-sm flex items-center gap-1.5">
                  ⚠ Risk Indicator: {risk.title}
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded font-mono text-[11px]">
                  Severity: {risk.severity}
                </span>
              </div>
              <p className="leading-relaxed font-medium">{risk.description}</p>

              <div className="pt-2 border-t border-black/10 font-mono text-[11px] bg-white/60 p-2.5 rounded">
                <strong>Verified Evidence: </strong>
                {risk.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Verification Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Clause-by-Clause Verified Evidence Matrix
          </h3>
          <span className="text-xs text-slate-300 font-mono">Audit Complete</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-900 uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Requirement</th>
                <th className="p-3.5">Submitted Evidence Document</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5 text-right">Clause Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((m: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-bold text-slate-900">{m.requirement}</td>
                  <td className="p-3.5 font-mono text-slate-600">{m.evidence}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold font-mono text-slate-800">{m.confidence}</td>
                  <td className="p-3.5 text-right font-semibold text-blue-900 text-[11px]">{m.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Human-in-the-Loop Officer Control Panel */}
      <HumanReviewPanel
        bidId={bidId}
        currentStatus={summary.review_status || "PENDING_OFFICER_REVIEW"}
        onActionCompleted={loadBid}
      />
    </div>
  );
}
