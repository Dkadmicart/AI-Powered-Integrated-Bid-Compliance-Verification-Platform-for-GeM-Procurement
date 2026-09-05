import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeM SmartBid AI - AI-Powered Procurement Intelligence",
  description: "AI-powered integrated bid compliance verification platform for GeM procurement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html font-family="Inter" lang="en" className="h-full bg-slate-50 text-slate-900">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
