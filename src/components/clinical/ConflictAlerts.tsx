"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  HelpCircle,
  Check,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { ClinicalConflict } from "@/types/clinical";

interface ConflictAlertsProps {
  conflicts: ClinicalConflict[];
  onSelectConflictDocument?: (docId: string) => void;
}

export function ConflictAlerts({ conflicts, onSelectConflictDocument }: ConflictAlertsProps) {
  const [acknowledgedIds, setAcknowledgedIds] = useState<Record<string, boolean>>({});

  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-3">
      {conflicts.map((conflict) => {
        const isAcknowledged = acknowledgedIds[conflict.id];
        const isCritical = conflict.severity === "CRITICAL";

        return (
          <div
            key={conflict.id}
            className={`p-4 rounded-2xl border transition-all ${
              isAcknowledged
                ? "bg-slate-900/40 border-slate-800 opacity-70"
                : isCritical
                ? "bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-slate-950 border-rose-600/80 shadow-lg shadow-rose-950/30"
                : "bg-gradient-to-r from-amber-950/30 via-amber-900/20 to-slate-950 border-amber-600/60 shadow"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    isCritical
                      ? "bg-rose-600/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {isCritical ? (
                    <AlertOctagon className="w-5 h-5 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? "bg-rose-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {conflict.severity} Clinical Conflict
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Type: {conflict.type.replace(/_/g, " ")}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm sm:text-base mt-1.5">
                    {conflict.title}
                  </h4>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {conflict.description}
                  </p>

                  {/* Clinical Implication */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Clinical Safety Evaluation:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {conflict.clinicalImplication}
                    </p>
                  </div>

                  {/* Suggested Doctor Question */}
                  <div className="mt-2 p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs">
                    <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                      <span>Recommended Question for Your Physician:</span>
                    </div>
                    <p className="text-teal-100 text-xs italic">
                      &quot;{conflict.suggestedDoctorQuestion}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Acknowledge Button */}
              <button
                onClick={() => toggleAcknowledge(conflict.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                  isAcknowledged
                    ? "bg-slate-800 text-slate-400 border border-slate-700"
                    : "bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700 shadow"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isAcknowledged ? "Acknowledged" : "Review & Acknowledge"}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
