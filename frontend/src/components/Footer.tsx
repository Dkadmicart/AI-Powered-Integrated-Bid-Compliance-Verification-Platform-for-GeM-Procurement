import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>GeM SmartBid AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Powered Integrated Bid Compliance Verification Platform designed for Government e-Marketplace procurement.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Seller Capabilities</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="hover:text-white transition-colors">AI Tender Finder</Link></li>
              <li><Link href="/compliance" className="hover:text-white transition-colors">Bid Compliance Checker</Link></li>
              <li><Link href="/company" className="hover:text-white transition-colors">Company Intelligence</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Government Officer Portal</h4>
            <ul className="space-y-2">
              <li><Link href="/government" className="hover:text-white transition-colors">Bid Evaluation Assistant</Link></li>
              <li><Link href="/government/bids/BID-2026-001" className="hover:text-white transition-colors">Audit & Risk Analysis</Link></li>
              <li><span className="text-slate-500">Human-in-the-Loop Controls</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">SIH Prototype Disclaimer</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              This independent AI intelligence layer operates on synthetic demo data for SIH evaluation. Final procurement decisions remain with authorized government officials.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-slate-500">
          <p>© 2026 GeM SmartBid AI. Smart India Hackathon Prototype.</p>
          <p className="mt-2 md:mt-0 font-mono text-[11px]">Tagline: Find. Understand. Comply. Procure Smarter.</p>
        </div>
      </div>
    </footer>
  );
}
