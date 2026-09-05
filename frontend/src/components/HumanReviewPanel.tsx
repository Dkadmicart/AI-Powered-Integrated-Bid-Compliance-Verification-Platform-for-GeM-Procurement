"use client";

import { useState } from "react";
import { Shield, CheckCircle, AlertCircle, XCircle, HelpCircle, FileText, UserCheck } from "lucide-react";
import { executeOfficerAction } from "@/lib/api";

interface HumanReviewPanelProps {
  bidId: string;
  currentStatus: string;
  onActionCompleted?: () => void;
}

export default function HumanReviewPanel({ bidId, currentStatus, onActionCompleted }: HumanReviewPanelProps) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await executeOfficerAction(bidId, action, notes);
      setStatus(res.new_review_status);
      setFeedback(`Officer action recorded successfully: ${action.replace("_", " ")}`);
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      setFeedback("Failed to update officer decision status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-6 text-xs">
      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start space-x-3 text-amber-900">
        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Human-in-the-Loop Officer Control Directive</h4>
          <p className="mt-0.5 leading-relaxed text-xs">
            AI provides decision support and evidence extraction only. Final procurement decisions remain strictly with authorized government procurement officials.
          </p>
        </div>
      </div>

      {/* AI Recommendation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-slate-500 font-medium block">AI Recommendation</span>
          <span className="text-sm font-extrabold text-blue-900 flex items-center gap-1 mt-0.5">
            <UserCheck className="w-4 h-4 text-blue-700" />
            Qualified for Technical Evaluation
          </span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Current Officer Status</span>
          <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded inline-block mt-0.5">
            {status}
          </span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Audit Trail Status</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block mt-0.5">
            Logging Active
          </span>
        </div>
      </div>

      {/* Officer Notes Textarea */}
      <div className="space-y-1.5">
        <label className="font-bold text-slate-800 text-xs block">
          Procurement Officer Audit Remarks / Notes:
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter official reasoning, clarification request details, or audit notes..."
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Decision Action Buttons */}
      <div className="space-y-3">
        <span className="font-bold text-slate-900 text-xs block">Select Official Action:</span>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleAction("APPROVE")}
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <CheckCircle className="w-4 h-4" />
            Approve for Further Review
          </button>

          <button
            onClick={() => handleAction("REQUEST_CLARIFICATION")}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <HelpCircle className="w-4 h-4" />
            Request Clarification
          </button>

          <button
            onClick={() => handleAction("MARK_NON_COMPLIANT")}
            disabled={loading}
            className="bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <XCircle className="w-4 h-4" />
            Mark Non-Compliant
          </button>

          <button
            onClick={() => handleAction("MANUAL_REVIEW")}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-4 h-4" />
            Manual Review
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 font-semibold rounded-lg text-xs">
          {feedback}
        </div>
      )}
    </div>
  );
}
