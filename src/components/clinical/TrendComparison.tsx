"use client";

import React from "react";
import { TrendingUp, TrendingDown, Clock, ArrowRight, AlertTriangle } from "lucide-react";

interface TrendItem {
  testName: string;
  baselineDate: string;
  baselineValue: string;
  baselineNumeric: number;
  currentDate: string;
  currentValue: string;
  currentNumeric: number;
  unit: string;
  direction: "UP" | "DOWN";
  delta: string;
  isConcerning: boolean;
  clinicalNote: string;
}

export function TrendComparison() {
  const trends: TrendItem[] = [
    {
      testName: "Hemoglobin A1c (HbA1c)",
      baselineDate: "Jan 12, 2026",
      baselineValue: "6.9",
      baselineNumeric: 6.9,
      currentDate: "Jun 12, 2026",
      currentValue: "8.9",
      currentNumeric: 8.9,
      unit: "%",
      direction: "UP",
      delta: "+2.0%",
      isConcerning: true,
      clinicalNote: "Sharp glycemic increase over 5 months. Exceeds typical ADA target (<7.0%).",
    },
    {
      testName: "Serum Creatinine",
      baselineDate: "Jan 12, 2026",
      baselineValue: "1.05",
      baselineNumeric: 1.05,
      currentDate: "Jun 12, 2026",
      currentValue: "1.85",
      currentNumeric: 1.85,
      unit: "mg/dL",
      direction: "UP",
      delta: "+0.80 mg/dL",
      isConcerning: true,
      clinicalNote: "Acute jump indicating reduced renal filtration capacity. Prompts Metformin safety review.",
    },
    {
      testName: "eGFR (Kidney Filtration)",
      baselineDate: "Jan 12, 2026",
      baselineValue: "68",
      baselineNumeric: 68,
      currentDate: "Jun 12, 2026",
      currentValue: "38",
      currentNumeric: 38,
      unit: "mL/min",
      direction: "DOWN",
      delta: "-30 mL/min",
      isConcerning: true,
      clinicalNote: "Shift from Stage 2 to Stage 3b chronic kidney impairment.",
    },
    {
      testName: "Hemoglobin (Hgb)",
      baselineDate: "Jan 12, 2026",
      baselineValue: "12.8",
      baselineNumeric: 12.8,
      currentDate: "Jun 12, 2026",
      currentValue: "10.2",
      currentNumeric: 10.2,
      unit: "g/dL",
      direction: "DOWN",
      delta: "-2.6 g/dL",
      isConcerning: true,
      clinicalNote: "Drop into anemic range with low red cell indices (microcytic).",
    },
  ];

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-slate-200">
            Longitudinal Trend Comparison (Prior vs Current)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Baseline (Jan 2026) &rarr; Current (Jun 2026)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {trends.map((trend, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border flex flex-col justify-between ${
              trend.isConcerning
                ? "bg-slate-900/70 border-slate-700 hover:border-amber-500/50 transition"
                : "bg-slate-900/40 border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-slate-200 text-xs">
                  {trend.testName}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    trend.isConcerning
                      ? "bg-amber-950 text-amber-300 border border-amber-700/60"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {trend.direction === "UP" ? (
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-amber-400" />
                  )}
                  {trend.delta}
                </span>
              </div>

              {/* Visual Shift */}
              <div className="flex items-center gap-3 my-2 text-xs font-mono">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-center flex-1">
                  <div className="text-[10px] uppercase text-slate-500">{trend.baselineDate}</div>
                  <div className="font-bold text-slate-300">
                    {trend.baselineValue} {trend.unit}
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

                <div className="p-1.5 rounded bg-slate-950 border border-teal-500/40 text-teal-300 text-center flex-1">
                  <div className="text-[10px] uppercase text-teal-400/70">{trend.currentDate}</div>
                  <div className="font-bold text-white">
                    {trend.currentValue} {trend.unit}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 italic border-t border-slate-800/60 pt-1.5">
              &bull; {trend.clinicalNote}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
