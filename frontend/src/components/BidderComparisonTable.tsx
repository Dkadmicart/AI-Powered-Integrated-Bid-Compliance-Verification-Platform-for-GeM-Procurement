"use client";

import Link from "next/link";
import { Shield, Eye, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

export interface BidderRow {
  bid_id: string;
  company_id: string;
  company_name: string;
  technical_score: string;
  financial_eligibility: "PASS" | "FAIL" | "REVIEW";
  document_compliance: string;
  overall_compliance: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  review_status: string;
}

export default function BidderComparisonTable({ bidders }: { bidders: BidderRow[] }) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "LOW":
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">LOW</span>;
      case "MEDIUM":
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">MEDIUM</span>;
      case "HIGH":
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300 animate-pulse">HIGH</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded">UNKNOWN</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status.includes("APPROVED")) {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          APPROVED
        </span>
      );
    }
    if (status.includes("NON_COMPLIANT")) {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold px-2 py-0.5 rounded">
          <XCircle className="w-3 h-3 text-rose-600" />
          NON-COMPLIANT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded">
        <Clock className="w-3 h-3 text-amber-600" />
        OFFICER REVIEW
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm">Submitted Bids Matrix & Risk Screening</h3>
        </div>
        <span className="text-xs text-slate-300 font-mono">{bidders.length} Bidders Evaluated</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-3.5">Company Name</th>
              <th className="p-3.5">Technical Score</th>
              <th className="p-3.5">Financial Eligibility</th>
              <th className="p-3.5">Document Compliance</th>
              <th className="p-3.5">Overall Compliance</th>
              <th className="p-3.5">Risk Indicator</th>
              <th className="p-3.5">Review Status</th>
              <th className="p-3.5 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bidders.map((bid) => (
              <tr key={bid.bid_id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">
                  <Link href={`/government/bids/${bid.bid_id}`} className="hover:text-blue-700 hover:underline">
                    {bid.company_name}
                  </Link>
                </td>
                <td className="p-3.5 font-semibold text-slate-900 font-mono">{bid.technical_score}</td>
                <td className="p-3.5">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      bid.financial_eligibility === "PASS"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {bid.financial_eligibility}
                  </span>
                </td>
                <td className="p-3.5 font-semibold font-mono text-slate-800">{bid.document_compliance}</td>
                <td className="p-3.5 font-bold font-mono text-blue-900">{bid.overall_compliance}</td>
                <td className="p-3.5">{getRiskBadge(bid.risk_level)}</td>
                <td className="p-3.5">{getStatusBadge(bid.review_status)}</td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/government/bids/${bid.bid_id}`}
                    className="inline-flex items-center gap-1 bg-blue-900 hover:bg-blue-800 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Deep Audit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
