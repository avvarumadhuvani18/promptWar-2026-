import React from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

interface SafetyBarProps {
  isDemoMode?: boolean;
}

export const SafetyBar: React.FC<SafetyBarProps> = ({ isDemoMode = true }) => {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="leading-tight text-slate-300">
            <strong className="text-emerald-400 font-semibold">Clinical Safety Rule:</strong>{" "}
            MedLens never diagnoses disease, prescribes medication, or recommends dosage changes. Reference ranges are extracted strictly from source documents.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDemoMode ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO MODE &bull; Fictional Patient Record</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE AI &bull; Gemini Connected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
