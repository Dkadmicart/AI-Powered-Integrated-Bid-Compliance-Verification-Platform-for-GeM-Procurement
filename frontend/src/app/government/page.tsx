"use client";

import { useEffect, useState } from "react";
import { Landmark, Shield, AlertCircle, CheckCircle, Clock, FileText, Search, Filter } from "lucide-react";
import { fetchGovernmentTenderBids } from "@/lib/api";
import BidderComparisonTable from "@/components/BidderComparisonTable";

export default function GovernmentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchGovernmentTenderBids("TND-2026-001");
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 animate-pulse space-y-3">
        <Landmark className="w-8 h-8 text-blue-900 mx-auto animate-spin" />
        <p className="font-semibold text-xs">Loading government evaluation assistant & screening submitted bids...</p>
      </div>
    );
  }

  const bidders = data?.bidders || [];
  const filteredBidders = bidders.filter((b: any) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "REVIEW") return b.review_status.includes("REVIEW") || b.review_status.includes("PENDING");
    if (filterStatus === "APPROVED") return b.review_status.includes("APPROVED");
    if (filterStatus === "NON_COMPLIANT") return b.review_status.includes("NON_COMPLIANT");
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Government Bid Evaluation Assistant</h1>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Tender: <strong className="text-slate-900">{data?.tender_title}</strong> ({data?.department})
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Decision Support Active</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Total Submitted Bids</span>
          <p className="text-3xl font-extrabold text-slate-900">{data?.statistics?.total_bids || 126}</p>
          <span className="text-slate-400 text-[11px]">Envelope A & B Received</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Eligible Bidders</span>
          <p className="text-3xl font-extrabold text-emerald-700">{data?.statistics?.eligible || 94}</p>
          <span className="text-emerald-700 text-[11px] font-semibold">100% Mandatory Compliance</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Needs Officer Review</span>
          <p className="text-3xl font-extrabold text-amber-600">{data?.statistics?.needs_review || 21}</p>
          <span className="text-amber-700 text-[11px] font-semibold">Requires Clarification</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Non-Compliant Bids</span>
          <p className="text-3xl font-extrabold text-rose-700">{data?.statistics?.non_compliant || 11}</p>
          <span className="text-rose-700 text-[11px] font-semibold">Turnover / Document Failure</span>
        </div>
      </div>

      {/* Filter Tabs & Comparison Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-800">Filter Submitted Bids:</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === "ALL" ? "bg-blue-900 text-white shadow-2xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Bids ({bidders.length})
            </button>
            <button
              onClick={() => setFilterStatus("REVIEW")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === "REVIEW" ? "bg-amber-600 text-white shadow-2xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilterStatus("APPROVED")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === "APPROVED" ? "bg-emerald-700 text-white shadow-2xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus("NON_COMPLIANT")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === "NON_COMPLIANT" ? "bg-rose-700 text-white shadow-2xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Non-Compliant
            </button>
          </div>
        </div>

        {/* Bidder Matrix */}
        <BidderComparisonTable bidders={filteredBidders} />
      </div>
    </div>
  );
}
