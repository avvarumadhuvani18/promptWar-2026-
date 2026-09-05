"use client";

import React from "react";
import { Pill, CheckCircle, Edit3, FileSearch, AlertCircle, AlertTriangle } from "lucide-react";
import { Medication, ClinicalConflict } from "@/types/clinical";
import { Provenance } from "@/types/provenance";

interface MedicationListProps {
  medications: Medication[];
  conflicts: ClinicalConflict[];
  onSelectProvenance: (provenance: Provenance) => void;
  onVerifyMedication: (med: Medication) => void;
}

export function MedicationList({
  medications,
  conflicts,
  onSelectProvenance,
  onVerifyMedication,
}: MedicationListProps) {
  // Check if a medication is involved in any active clinical conflict
  const isMedicationConflicted = (med: Medication) => {
    return conflicts.find((c) =>
      c.involvedItems.some(
        (item) =>
          item.toLowerCase().includes(med.drugName.toLowerCase()) ||
          med.drugName.toLowerCase().includes(item.toLowerCase())
      )
    );
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200">
            Active & Prescribed Medications
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {medications.length} Regimens Documented
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {medications.map((med) => {
          const conflict = isMedicationConflicted(med);

          return (
            <div
              key={med.id}
              className={`p-3.5 rounded-xl border transition relative flex flex-col justify-between ${
                conflict?.severity === "CRITICAL"
                  ? "bg-rose-950/30 border-rose-600/80 shadow-lg shadow-rose-950/20"
                  : conflict?.severity === "WARNING"
                  ? "bg-amber-950/20 border-amber-600/60"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">
                      {med.drugName}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {med.dosage}
                    </span>
                  </div>

                  {conflict && (
                    <span
                      title={conflict.title}
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        conflict.severity === "CRITICAL"
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {conflict.severity === "CRITICAL" ? "Allergy Conflict" : "Dose Warning"}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  <strong className="text-slate-300 font-medium">Sig:</strong> {med.frequency}
                </p>

                {med.purpose && (
                  <p className="text-[11px] text-teal-400/90 mt-0.5">
                    Indication: {med.purpose}
                  </p>
                )}

                {conflict && (
                  <div className="mt-2 p-2 rounded bg-rose-950/60 border border-rose-800/80 text-[11px] text-rose-200">
                    <strong className="font-semibold block mb-0.5">Safety Alert:</strong>
                    {conflict.description}
                  </div>
                )}
              </div>

              {/* Provenance & Verification Footer */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectProvenance(med.provenance)}
                  title="Trace verbatim order in prescription document"
                  className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-mono transition"
                >
                  <FileSearch className="w-3 h-3" />
                  <span>p.{med.provenance.pageNumber} in Rx</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {med.verificationStatus === "VERIFIED" ? (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerifyMedication(med)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-600 text-slate-300 hover:text-emerald-300 transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
