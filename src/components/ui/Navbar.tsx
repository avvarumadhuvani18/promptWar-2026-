"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  FilePlus,
  History,
  Download,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface NavbarProps {
  currentPatientId?: string;
  isDemoMode?: boolean;
  onOpenAudit?: () => void;
  onOpenExport?: () => void;
  onResetDemo?: () => void;
}

export function Navbar({
  currentPatientId,
  isDemoMode,
  onOpenAudit,
  onOpenExport,
  onResetDemo,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-lg shadow-teal-900/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">MedLens</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
                  v1.0 MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Clinical Information Intelligence
              </p>
            </div>
          </Link>

          {isDemoMode && (
            <div className="ml-3 hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Fictional Demo Environment</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isDemoMode && onResetDemo && (
            <button
              onClick={onResetDemo}
              title="Reset sample patient record back to initial demo state"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}

          {onOpenAudit && (
            <button
              onClick={onOpenAudit}
              title="View complete audit trail of automated extractions and user verifications"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>
          )}

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              title="Export printable clinical handover passport"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Export Passport</span>
            </button>
          )}

          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-md shadow-teal-900/20 transition"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Upload Reports</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
