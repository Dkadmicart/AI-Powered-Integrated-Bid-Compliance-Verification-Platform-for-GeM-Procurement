"use client";

import { CheckCircle2, AlertTriangle, XCircle, FileText, Upload, HelpCircle } from "lucide-react";

export interface ComplianceItem {
  requirement: string;
  evidence: string;
  status: "PASS" | "FAIL" | "REVIEW";
  confidence: number;
  source_clause?: string;
  page_number?: number;
  failure_reason?: string;
}

interface ComplianceTableProps {
  items: ComplianceItem[];
  onUploadClick?: () => void;
  onViewClauseClick?: (clause: string) => void;
}

export default function ComplianceTable({ items, onUploadClick, onViewClauseClick }: ComplianceTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            PASS
          </span>
        );
      case "REVIEW":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            REVIEW
          </span>
        );
      case "FAIL":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            FAIL
          </span>
        );
      default:
        return null;
    }
  };

  const failedItems = items.filter((i) => i.status === "FAIL");

  return (
    <div className="space-y-6">
      {/* Evidence-Based Compliance Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Bid Compliance Verification Matrix
          </h3>
          <span className="text-xs text-slate-300 font-mono">
            {items.filter((i) => i.status === "PASS").length} / {items.length} Requirements Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">Requirement</th>
                <th className="p-3.5">Evidence Verified</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">{item.requirement}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">{item.evidence}</td>
                  <td className="p-3.5">{getStatusBadge(item.status)}</td>
                  <td className="p-3.5 font-semibold font-mono text-slate-800">{item.confidence}%</td>
                  <td className="p-3.5 text-right space-x-2">
                    {item.source_clause && (
                      <button
                        onClick={() => onViewClauseClick && onViewClauseClick(item.source_clause!)}
                        className="text-blue-700 hover:text-blue-900 font-semibold underline underline-offset-2 text-[11px]"
                      >
                        Clause Ref
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failure Reason Callouts */}
      {failedItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            AI Compliance Action Required ({failedItems.length} Non-Compliant Item)
          </h4>

          {failedItems.map((fail, idx) => (
            <div
              key={idx}
              className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-sm flex items-center gap-2">
                  🔴 {fail.requirement} missing or non-compliant
                </span>
                <span className="text-rose-700 font-mono text-[11px] bg-rose-100 px-2 py-0.5 rounded">
                  Confidence {fail.confidence}%
                </span>
              </div>
              <p className="text-rose-800 leading-relaxed font-medium">
                <span className="font-bold">Reason: </span>
                {fail.failure_reason ||
                  `The tender requires ${fail.requirement} under ${fail.source_clause || "Eligibility Clause"}. No matching certificate was found in supplied company evidence.`}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onViewClauseClick && onViewClauseClick(fail.source_clause || "Clause 4.2")}
                  className="bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-700" />
                  View Clause
                </button>
                <button
                  onClick={onUploadClick}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
