"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Info, Sparkles } from "lucide-react";
import { MANDATORY_SAFETY_DISCLAIMER } from "@/lib/clinical/safety-guardrails";

interface SafetyBannerProps {
  isDemoMode?: boolean;
  geminiAvailable?: boolean;
}

export function SafetyBanner({ isDemoMode = false, geminiAvailable = false }: SafetyBannerProps) {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        {/* Safety Notice */}
        <div className="flex items-center gap-2 flex-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-slate-300 leading-tight">
            <strong className="text-emerald-400 font-semibold">Clinical Assistive System:</strong>{" "}
            {MANDATORY_SAFETY_DISCLAIMER}
          </p>
        </div>

        {/* Live vs Demo Mode Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {isDemoMode ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO MODE &bull; Fictional Synthetic Dataset</span>
            </div>
          ) : geminiAvailable ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>LIVE AI &bull; Gemini 2.0 Flash</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <Info className="w-3 h-3 text-slate-400" />
              <span>API Key Inactive</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
