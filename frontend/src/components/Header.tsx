"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Search, Bot, FileCheck, Building2, Landmark, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [role, setRole] = useState<"seller" | "officer">("seller");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: Shield },
    { name: "AI Tender Finder", href: "/search", icon: Search },
    { name: "Tender Copilot", href: "/tenders/TND-2026-001", icon: Bot },
    { name: "Bid Compliance", href: "/compliance", icon: FileCheck },
    { name: "Company Intelligence", href: "/company", icon: Building2 },
    { name: "Government Evaluation", href: "/government", icon: Landmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[10px] tracking-wide border border-amber-500/30 uppercase">
            AI-Assisted Prototype
          </span>
          <span className="hidden md:inline text-slate-400">
            Decision support platform. Final procurement decisions remain with authorized government officials.
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 font-mono text-[11px]">GeM API Ready v1.0</span>
        </div>
      </div>

      {/* Main Header Branding & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-md group-hover:bg-blue-800 transition-colors">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">GeM SmartBid AI</span>
              </div>
              <span className="text-xs text-slate-500 font-medium block -mt-0.5">
                AI-Powered Procurement Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-900 border border-blue-200/60 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher Toggle */}
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 hidden sm:flex">
              <button
                onClick={() => setRole("seller")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  role === "seller" ? "bg-white text-blue-950 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => setRole("officer")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  role === "officer" ? "bg-blue-900 text-white shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Govt Officer
              </button>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                  {role === "seller" ? "SG" : "GO"}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden md:inline">
                  {role === "seller" ? "SecureGrid Tech" : "Officer R. Sharma"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">
                      {role === "seller" ? "SecureGrid Technologies" : "Officer Rajesh Sharma"}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {role === "seller" ? "GST: 07AAAAA0000A1Z5" : "Ministry of Petroleum"}
                    </p>
                  </div>
                  <Link
                    href="/company"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Company Intelligence Profile
                  </Link>
                  <Link
                    href="/government"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Government Officer Portal
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-4 py-1.5 text-[11px] text-slate-400">
                    Active Session: Authorized Demo
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
