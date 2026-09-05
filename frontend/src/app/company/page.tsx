"use client";

import { useEffect, useState } from "react";
import { Building2, Award, CheckCircle2, TrendingUp, BarChart3, PieChart as PieIcon, Shield, Layers } from "lucide-react";
import { fetchCompanyIntelligence } from "@/lib/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";

export default function CompanyIntelligencePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCompanyIntelligence("COMP-001");
        setProfile(data);
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
        <Building2 className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
        <p className="font-semibold text-xs">Loading seller intelligence dashboard and compliance analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{profile.company_name}</h1>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Seller Intelligence Profile, GST Verification Status & Historic Bid Analytics
          </p>
        </div>

        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs self-start md:self-auto flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          GST Status: {profile.gst_status}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Company Age & History</span>
          <p className="text-2xl font-extrabold text-slate-900">{profile.company_age}</p>
          <span className="text-slate-400 text-[11px]">Incorporated 2018</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Annual Turnover</span>
          <p className="text-2xl font-extrabold text-blue-900">{profile.annual_turnover}</p>
          <span className="text-emerald-700 text-[11px] font-semibold">CA Audited (3 Yrs)</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Domain Experience</span>
          <p className="text-2xl font-extrabold text-slate-900">{profile.experience}</p>
          <span className="text-slate-400 text-[11px]">Verified Credentials</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 font-medium">Historical Compliance Rate</span>
          <p className="text-2xl font-extrabold text-emerald-700">{profile.bid_history?.compliance_rate}</p>
          <span className="text-slate-500 text-[11px]">{profile.bid_history?.total_bids} Total Bids</span>
        </div>
      </div>

      {/* Charts & AI Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Recharts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart 1: Bid Participation vs Success */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Bid Participation vs Contract Wins (6 Month History)
              </span>
              <span className="text-slate-400 text-[11px] font-mono">Win Rate: {profile.bid_history?.win_rate_percentage}%</span>
            </h3>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profile.charts?.bid_participation || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="submitted" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Bids Submitted" />
                  <Bar dataKey="won" fill="#16a34a" radius={[4, 4, 0, 0]} name="Contracts Won" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Quarterly Compliance Rate Trend */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Quarterly Document Compliance & Readiness Trend
            </h3>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profile.charts?.compliance_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} name="Compliance Score %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: AI Capabilities & Suitable Categories */}
        <div className="lg:col-span-4 space-y-6">
          {/* Capabilities Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Verified Core Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.strong_capabilities?.map((cap: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-900 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 text-xs"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Suitable Tender Categories Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              AI Recommended GeM Tender Categories
            </h3>
            <ul className="space-y-2">
              {profile.suitable_tender_categories?.map((cat: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Synthetic Data Notice */}
          <div className="p-4 bg-slate-100 rounded-xl text-slate-500 text-[11px] leading-relaxed border border-slate-200">
            <strong>Synthetic Demo Notice:</strong> Production GST/MCA/GeM company credentials must be populated only from authorized government API integrations.
          </div>
        </div>
      </div>
    </div>
  );
}
