"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import { MedicalDocument } from "@/types/clinical";

interface DocumentViewerProps {
  documents: MedicalDocument[];
  activeDocumentId: string;
  onSelectDocument: (docId: string) => void;
  highlightSnippet?: string | null;
}

export function DocumentViewer({
  documents,
  activeDocumentId,
  onSelectDocument,
  highlightSnippet,
}: DocumentViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const activeDoc = documents.find((d) => d.id === activeDocumentId) || documents[0];
  const highlightedRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to highlighted snippet when changed
  useEffect(() => {
    if (highlightSnippet && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightSnippet]);

  if (!activeDoc) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
        <p>No documents available to display.</p>
      </div>
    );
  }

  // Split raw text into lines for line-by-line inspection and precise highlighting
  const lines = (activeDoc.rawText || "No raw text available for this document.").split("\n");

  // Determine if a line matches the snippet
  const isLineHighlighted = (line: string): boolean => {
    if (!highlightSnippet) return false;
    const cleanLine = line.toLowerCase().replace(/\s+/g, " ").trim();
    const cleanSnippet = highlightSnippet.toLowerCase().replace(/\s+/g, " ").trim();
    
    // Check direct inclusion or token overlap
    if (cleanLine.includes(cleanSnippet) || cleanSnippet.includes(cleanLine)) {
      return true;
    }

    // Try finding key test name + value in the line
    const snippetWords = cleanSnippet.split(" ").filter((w) => w.length > 2);
    if (snippetWords.length >= 2) {
      const matchCount = snippetWords.filter((w) => cleanLine.includes(w)).length;
      return matchCount >= 2;
    }

    return false;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Top Bar / Document Switcher */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={activeDoc.id}
                onChange={(e) => onSelectDocument(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.documentType}: {doc.filename}
                  </option>
                ))}
              </select>

              {activeDoc.isFictionalDemo ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-600/50 text-amber-300 font-medium whitespace-nowrap">
                  Demo Document
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/50 text-emerald-300 font-medium">
                  User Upload
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Facility: {activeDoc.facilityName} &bull; Date: {activeDoc.reportDate || "N/A"}
            </p>
          </div>
        </div>

        {/* Search within document */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Find in document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Provenance Active Callout Banner */}
      {highlightSnippet && (
        <div className="px-4 py-2 bg-emerald-950/70 border-b border-emerald-800/80 flex items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <Eye className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span className="font-semibold text-emerald-300 shrink-0">
              Active Provenance Citation:
            </span>
            <span className="truncate italic text-slate-200 max-w-md">
              &quot;{highlightSnippet}&quot;
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-700 text-emerald-200 shrink-0">
            Source Linked
          </span>
        </div>
      )}

      {/* Document Content View */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950 selection:bg-teal-500/30">
        <div className="max-w-3xl mx-auto space-y-0.5">
          {lines.map((line, idx) => {
            const isHighlighted = isLineHighlighted(line);
            const matchesSearch =
              searchQuery.trim().length > 0 &&
              line.toLowerCase().includes(searchQuery.toLowerCase());

            return (
              <div
                key={idx}
                ref={isHighlighted ? highlightedRef : undefined}
                className={`flex items-start gap-3 px-2.5 py-1 rounded transition-colors ${
                  isHighlighted
                    ? "bg-emerald-500/20 border-l-4 border-emerald-400 text-emerald-100 font-semibold shadow-inner"
                    : matchesSearch
                    ? "bg-amber-500/20 border-l-2 border-amber-400 text-amber-100"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <span className="text-[10px] text-slate-600 select-none w-7 text-right shrink-0 pt-0.5">
                  {idx + 1}
                </span>
                <span className="whitespace-pre-wrap break-all flex-1">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Original Document: {activeDoc.filename}</span>
        <span className="text-slate-500">
          Traceability Index: Verbatim Character Stream &bull; Click any observation to locate
        </span>
      </div>
    </div>
  );
}
