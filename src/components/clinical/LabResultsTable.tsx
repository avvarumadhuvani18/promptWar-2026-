"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle,
  Edit3,
  ExternalLink,
  AlertTriangle,
  FileSearch,
  Filter,
  Info,
} from "lucide-react";
import { LabObservation, LabCategory } from "@/types/clinical";
import { Provenance } from "@/types/provenance";

interface LabResultsTableProps {
  observations: LabObservation[];
  onSelectProvenance: (provenance: Provenance) => void;
  onVerifyObservation: (obs: LabObservation) => void;
  onEditObservation: (obs: LabObservation) => void;
}

export function LabResultsTable({
  observations,
  onSelectProvenance,
  onVerifyObservation,
  onEditObservation,
}: LabResultsTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    { key: "ALL", label: "All Tests", count: observations.length },
    {
      key: "DIABETES",
      label: "Diabetes",
      count: observations.filter((o) => o.category === "DIABETES").length,
    },
    {
      key: "BIOCHEMISTRY",
      label: "CMP & Renal",
      count: observations.filter((o) => o.category === "BIOCHEMISTRY").length,
    },
    {
      key: "HEMATOLOGY",
      label: "Hematology",
      count: observations.filter((o) => o.category === "HEMATOLOGY").length,
    },
    {
      key: "LIPID",
      label: "Lipid Panel",
      count: observations.filter((o) => o.category === "LIPID").length,
    },
  ];

  const filtered = observations.filter((o) => {
    if (selectedCategory === "ALL") return true;
    return o.category === selectedCategory;
  });

  const getInterpretationBadge = (interpretation: string, isCritical: boolean) => {
    if (isCritical) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          CRITICAL
        </span>
      );
    }
    switch (interpretation) {
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-950/80 text-orange-300 border border-orange-700/60">
            HIGH
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">
            LOW
          </span>
        );
      case "NORMAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            NORMAL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            {interpretation}
          </span>
        );
    }
  };

  const getVerificationBadge = (obs: LabObservation) => {
    switch (obs.verificationStatus) {
      case "VERIFIED":
        return (
          <span
            title={obs.verifiedBy ? `Verified by: ${obs.verifiedBy}` : "Verified"}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80"
          >
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case "EDITED":
        return (
          <span
            title="Clinically amended by human reviewer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/80"
          >
            <Edit3 className="w-3 h-3" />
            Edited
          </span>
        );
      default:
        return (
          <span
            title="Extracted from source report; pending clinical review"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
          >
            Extracted
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Category Tabs */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.key
                  ? "bg-teal-600 text-white shadow"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/50">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 shrink-0 hidden md:block">
          Deterministic Reference Engine Active
        </span>
      </div>

      {/* Observations Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3 px-4">Test Parameter</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Reference Range</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Provenance</th>
              <th className="py-3 px-4 text-right">Actions (HITL)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((obs) => (
              <tr
                key={obs.id}
                className="hover:bg-slate-900/40 transition group"
              >
                {/* Test Parameter */}
                <td className="py-3 px-4 font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <div>
                      <span className="font-semibold">{obs.testName}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500 uppercase">
                          {obs.category}
                        </span>
                        {obs.notes && (
                          <span className="text-[10px] text-slate-400 italic">
                            &bull; {obs.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Value */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-slate-100 font-mono">
                    {obs.value}
                  </span>
                  <span className="text-slate-400 text-xs ml-1 font-mono">
                    {obs.unit}
                  </span>
                </td>

                {/* Reference Range */}
                <td className="py-3 px-4 text-slate-300 font-mono whitespace-nowrap">
                  {obs.canonicalRange || obs.refRangeText || "Standard Review"}
                </td>

                {/* Interpretation Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {getInterpretationBadge(obs.interpretation, obs.isCritical)}
                </td>

                {/* Provenance & Engine Source */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => onSelectProvenance(obs.provenance)}
                    title="Click to view and highlight exact snippet in source document"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 text-[11px] font-mono hover:border-teal-500 transition group-hover:shadow"
                  >
                    <FileSearch className="w-3 h-3 text-teal-400" />
                    <span>p.{obs.provenance.pageNumber}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </button>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    {obs.provenance.extractionEngine === "PREDEFINED_DEMO_DATASET" ? (
                      <span className="text-amber-400/80">Synthetic Demo</span>
                    ) : (
                      <span className="text-emerald-400/80">Gemini Extracted</span>
                    )}
                    <span>&bull; {(obs.provenance.confidenceScore * 100).toFixed(0)}% conf</span>
                  </div>
                </td>

                {/* Actions (Human-in-the-Loop) */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {getVerificationBadge(obs)}

                    {obs.verificationStatus !== "VERIFIED" && (
                      <button
                        onClick={() => onVerifyObservation(obs)}
                        title="Mark as verified by human reviewer"
                        className="p-1 rounded bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-600 text-slate-300 hover:text-emerald-300 transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onEditObservation(obs)}
                      title="Edit this value / amend clinical observation"
                      className="p-1 rounded bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-600 text-slate-300 hover:text-sky-300 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
