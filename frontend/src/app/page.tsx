import Link from "next/link";
import { Search, Bot, FileCheck, Landmark, ArrowRight, ShieldCheck, CheckCircle, AlertCircle, Building2, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">GeM SmartBid AI Core Intelligence Layer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find the right tenders. <br />
            <span className="text-blue-400">Understand every requirement.</span> <br />
            Submit compliant bids.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            AI-powered tender discovery, document intelligence and bid compliance verification built for the Government e-Marketplace procurement ecosystem.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/search"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Best Tenders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/government"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center space-x-2"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Explore Government Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-slate-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Prototype: AI-assisted decision support. Final procurement decisions remain with authorized officials.
          </span>
        </div>
      </section>

      {/* KPI Stats Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Active GeM Tenders</span>
          <p className="text-2xl font-extrabold text-slate-900">1,482</p>
          <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Average Bid Readiness</span>
          <p className="text-2xl font-extrabold text-blue-900">94.2%</p>
          <span className="text-slate-500 text-[11px]">Automated clause audit</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Verified Sellers</span>
          <p className="text-2xl font-extrabold text-slate-900">8,520</p>
          <span className="text-emerald-700 text-[11px] font-semibold">GST & MCA Verified</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Evaluation Speedup</span>
          <p className="text-2xl font-extrabold text-emerald-700">6.5x</p>
          <span className="text-slate-500 text-[11px]">Government Officer Efficiency</span>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Core Platform Features</h2>
          <p className="text-slate-500 text-xs">Empowering sellers to find & comply, and officers to audit & evaluate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">1. AI Tender Finder</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Explainable matching algorithm scoring tenders against company turnover, experience, capability keywords, and certifications with transparent breakdown.
              </p>
            </div>
            <Link
              href="/search"
              className="text-blue-700 hover:text-blue-900 font-bold text-xs inline-flex items-center space-x-1 pt-2"
            >
              <span>Launch Tender Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">2. Tender Copilot</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                RAG-powered conversational document intelligence answering complex tender queries with exact clause numbers, page citations, and confidence metrics.
              </p>
            </div>
            <Link
              href="/tenders/TND-2026-001"
              className="text-blue-700 hover:text-blue-900 font-bold text-xs inline-flex items-center space-x-1 pt-2"
            >
              <span>Ask Tender Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">3. Bid Compliance Checker</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated compliance verification matrix identifying missing documents, turnover gaps, and non-compliant requirements prior to bid submission.
              </p>
            </div>
            <Link
              href="/compliance"
              className="text-blue-700 hover:text-blue-900 font-bold text-xs inline-flex items-center space-x-1 pt-2"
            >
              <span>Check Compliance Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
