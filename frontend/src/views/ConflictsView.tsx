import React from "react";
import { AlertOctagon, AlertTriangle, HelpCircle, Check, ShieldAlert, ArrowRight } from "lucide-react";
import { ClinicalConflict } from "@/types/clinical";

interface ConflictsViewProps {
  conflicts: ClinicalConflict[];
}

export const ConflictsView: React.FC<ConflictsViewProps> = ({ conflicts }) => {
  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          <span>Cross-Document Conflict &amp; Inconsistency Center</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          MedLens never presumes which conflicting value is correct. Both sources are presented side-by-side for clinical review.
        </p>
      </div>

      {/* Safety Directive Card */}
      <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-200 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Non-Deterministic Conflict Resolution:</strong> MedLens strictly avoids algorithmic bias when documents present contradictory facts. Both data points, their origins, and timestamps are displayed with the mandated label <span className="font-mono font-bold text-rose-300">Requires human verification</span>.
        </p>
      </div>

      {/* Conflicts List */}
      <div className="space-y-4">
        {conflicts.map((conflict) => {
          const isCritical = conflict.severity === "CRITICAL";

          return (
            <div
              key={conflict.id}
              className={`p-6 rounded-3xl border transition-all ${
                isCritical
                  ? "bg-gradient-to-r from-rose-950/40 via-rose-900/10 to-slate-950 border-rose-600/80 shadow-xl shadow-rose-950/20"
                  : "bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border-amber-600/60 shadow-lg"
              }`}
            >
              {/* Badge row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isCritical ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
                    }`}
                  >
                    {conflict.severity} Clinical Conflict
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Type: {conflict.conflictType.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Mandated Resolution Label */}
                <span className="text-xs px-3 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-200 font-bold font-mono tracking-tight animate-pulse">
                  {conflict.resolutionLabel}
                </span>
              </div>

              {/* Title & Narrative */}
              <h3 className="font-bold text-white text-base mt-2.5">
                {conflict.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {conflict.description}
              </p>

              {/* Conflicting Values Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                {/* Value A */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Documented Parameter A
                  </span>
                  <div className="font-bold text-slate-100 text-sm">{conflict.valueA}</div>
                  <div className="text-[11px] text-teal-400/90 font-mono pt-1">
                    Source: {conflict.sourceA}
                  </div>
                </div>

                {/* Value B */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Documented Parameter B
                  </span>
                  <div className="font-bold text-slate-100 text-sm">{conflict.valueB}</div>
                  <div className="text-[11px] text-rose-400/90 font-mono pt-1">
                    Source: {conflict.sourceB}
                  </div>
                </div>
              </div>

              {/* Recommended Question */}
              <div className="mt-4 p-3 rounded-2xl bg-teal-950/30 border border-teal-800/60 text-xs">
                <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <span>Recommended Patient Question for Doctor:</span>
                </div>
                <p className="text-teal-100 text-xs italic">
                  &quot;{conflict.suggestedDoctorQuestion}&quot;
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
