import React from "react";
import { Clock, TrendingUp, AlertCircle, FileText, Pill, ArrowUpRight } from "lucide-react";
import { TimelineEvent } from "@/types/clinical";

interface TimelineViewProps {
  events: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-400" />
          <span>Chronological Patient Timeline &amp; Shifts</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Sequential trail of laboratory panels, significant physiological shifts, and prescription events.
        </p>
      </div>

      {/* Longitudinal Shift Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-600/40 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
              Key Longitudinal Progression
            </span>
            <p className="text-slate-200 mt-0.5">
              HbA1c increased from 6.9% (Jan 2026) to 8.9% (Jun 2026) &bull; Serum Creatinine elevated from 1.05 to 1.85 mg/dL.
            </p>
          </div>
        </div>
      </div>

      {/* Chronological Event Stream */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
        {events.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-teal-400 shadow-md shadow-teal-950" />

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{ev.title}</span>
                  {ev.highlightValue && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                      {ev.highlightValue}
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-mono font-medium">
                  {ev.date}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ev.description}
              </p>

              {ev.sourceDocumentName && (
                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Source Document: {ev.sourceDocumentName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
