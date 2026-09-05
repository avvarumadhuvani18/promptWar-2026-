import React, { useState } from "react";
import { FileText, Eye, Download, Search, CheckCircle, Sparkles } from "lucide-react";
import { MedicalDocument } from "@/types/clinical";

interface ReportsViewProps {
  documents: MedicalDocument[];
  selectedDocumentId?: string;
  highlightSnippet?: string | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  documents,
  selectedDocumentId,
  highlightSnippet,
}) => {
  const [activeDocId, setActiveDocId] = useState(
    selectedDocumentId || documents[0]?.id || ""
  );
  const [search, setSearch] = useState("");

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];
  const lines = (activeDoc?.rawText || "").split("\n");

  const isLineHighlighted = (line: string): boolean => {
    if (!highlightSnippet) return false;
    const cleanLine = line.toLowerCase().replace(/\s+/g, " ");
    const cleanSnippet = highlightSnippet.toLowerCase().replace(/\s+/g, " ");
    return cleanLine.includes(cleanSnippet) || cleanSnippet.includes(cleanLine);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-400" />
          <span>Ingested Source Documents &amp; Provenance Stream</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Inspect original clinical documents, OCR character streams, and verbatim source bounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Document Selector Column (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select Document ({documents.length})
          </span>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = doc.id === activeDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-teal-500 shadow-md shadow-teal-950/20"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200 leading-tight">
                      {doc.filename}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                      {doc.documentType}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>Facility: {doc.facilityName}</span>
                    <span className="font-mono">{doc.reportDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verbatim Source Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
          {/* Viewer Top Bar */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-slate-200">
                Verbatim Report Stream: {activeDoc?.filename}
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search raw stream..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-44"
              />
            </div>
          </div>

          {/* Active Highlight Banner */}
          {highlightSnippet && (
            <div className="px-4 py-2 bg-emerald-950/70 border-b border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
              <span className="font-bold text-emerald-300">Active Provenance Highlight:</span>
              <span className="truncate italic font-mono">&quot;{highlightSnippet}&quot;</span>
            </div>
          )}

          {/* Raw Text Stream */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
            {lines.map((line, idx) => {
              const isHigh = isLineHighlighted(line);
              const matchesSearch = search && line.toLowerCase().includes(search.toLowerCase());

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 px-2 py-0.5 rounded ${
                    isHigh
                      ? "bg-emerald-500/20 border-l-4 border-emerald-400 text-emerald-100 font-semibold"
                      : matchesSearch
                      ? "bg-amber-500/20 border-l-2 border-amber-400 text-amber-100"
                      : "hover:bg-slate-900/50"
                  }`}
                >
                  <span className="text-[10px] text-slate-600 select-none w-6 text-right shrink-0">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre-wrap break-all flex-1">{line}</span>
                </div>
              );
            })}
          </div>

          {/* Viewer Footer */}
          <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Provenance Tracking: Character-offset and line-index mapped</span>
            <span className="font-mono text-teal-400 font-semibold">SOURCE AUTHENTICATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
