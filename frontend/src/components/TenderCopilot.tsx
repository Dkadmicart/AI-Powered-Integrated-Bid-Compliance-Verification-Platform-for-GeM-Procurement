"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, FileText, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { askTenderCopilot } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text?: string;
  answer?: string;
  source_clause?: string;
  page_number?: number;
  confidence?: number;
}

export default function TenderCopilot({ tenderId = "TND-2026-001" }: { tenderId?: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "copilot",
      answer: "Hello! I am your AI Tender Copilot. Ask me any technical, eligibility, or commercial question about this tender document.",
      source_clause: "Document Intelligence",
      page_number: 1,
      confidence: 100
    }
  ]);

  const presetQuestions = [
    "What is the minimum turnover?",
    "What documents are mandatory?",
    "What is the EMD?",
    "What are the technical requirements?",
    "What is the evaluation method?",
    "What are the payment terms?"
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setQuery("");
    setLoading(true);

    try {
      const res = await askTenderCopilot(tenderId, q);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        answer: res.answer,
        source_clause: res.source_clause,
        page_number: res.page_number,
        confidence: res.confidence
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "copilot",
          answer: "The tender document does not provide sufficient information to answer this question.",
          source_clause: "N/A",
          page_number: 0,
          confidence: 40
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md flex flex-col h-[600px]">
      {/* Copilot Header */}
      <div className="bg-slate-900 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              🤖 Tender Copilot
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                RAG Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">Clause-level document intelligence engine</p>
          </div>
        </div>
      </div>

      {/* Preset Questions Slider */}
      <div className="bg-slate-50 p-2 border-b border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none text-xs">
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            disabled={loading}
            className="whitespace-nowrap bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shadow-2xs"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                m.sender === "user"
                  ? "bg-blue-900 text-white rounded-br-none"
                  : "bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-none"
              }`}
            >
              {m.sender === "user" ? (
                <p className="font-medium text-xs">{m.text}</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium leading-relaxed text-slate-900 text-xs">{m.answer}</p>

                  {m.source_clause && m.source_clause !== "N/A" && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        <FileText className="w-3 h-3 text-blue-700" />
                        Source: {m.source_clause}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        Page: {m.page_number}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200/60">
                        Confidence: {m.confidence}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-500 animate-pulse flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Analyzing clause documents...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about this tender..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
