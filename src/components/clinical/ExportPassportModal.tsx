"use client";

import React from "react";
import { X, Printer, Download, ShieldCheck, Activity, AlertTriangle } from "lucide-react";
import { FullPatientRecord } from "@/types/clinical";

interface ExportPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FullPatientRecord;
}

export function ExportPassportModal({ isOpen, onClose, record }: ExportPassportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const flaggedLabs = record.observations.filter((o) => o.interpretation !== "NORMAL");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 print:border-none print:bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none">
        {/* Top actions (hidden when printing) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Clinical Health Passport & Physician Briefing
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 overflow-y-auto print:overflow-visible text-slate-200 print:text-black space-y-5 text-xs bg-slate-950 print:bg-white">
          {/* Header */}
          <div className="border-b-2 border-slate-800 print:border-black pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                MedLens Clinical Information Briefing
              </h1>
              <p className="text-slate-400 print:text-slate-600 text-xs mt-0.5">
                Structured Patient Health Record & Cross-Document Synthesis
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                Generated: {new Date().toLocaleDateString()}
              </span>
              <div className="text-[11px] text-teal-400 print:text-teal-700 font-bold">
                {record.patient.mrn}
              </div>
            </div>
          </div>

          {/* Demographics & Critical Allergies */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <div>
              <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-semibold">
                Patient Name
              </span>
              <strong className="text-slate-100 print:text-black text-sm">
                {record.patient.fullName}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-semibold">
                DOB & Age
              </span>
              <span className="text-slate-200 print:text-black font-mono">
                {record.patient.dob} ({record.patient.age}y, {record.patient.gender})
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-rose-400 print:text-rose-700 block text-[10px] uppercase font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Documented Allergies
              </span>
              <span className="text-rose-200 print:text-rose-900 font-bold">
                {record.patient.knownAllergies.join(", ") || "None Documented"}
              </span>
            </div>
          </div>

          {/* Clinical Conflicts / Safety Alerts */}
          {record.conflicts && record.conflicts.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/40 print:bg-rose-50 border border-rose-800/80 print:border-rose-400">
              <h4 className="font-bold text-rose-300 print:text-rose-800 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Urgent Clinical Cross-Document Alerts</span>
              </h4>
              <ul className="space-y-1 text-rose-200 print:text-rose-900 text-xs">
                {record.conflicts.map((c) => (
                  <li key={c.id}>
                    <strong>[{c.severity}]</strong> {c.title} &mdash;{" "}
                    <em>Suggested Question: {c.suggestedDoctorQuestion}</em>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Plain Language Summary */}
          {record.latestSummary && (
            <div className="p-3 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300">
              <h4 className="font-bold text-teal-400 print:text-teal-800 text-xs uppercase tracking-wider mb-1">
                Patient Plain-Language Overview
              </h4>
              <p className="text-slate-200 print:text-slate-800 text-xs leading-relaxed">
                {record.latestSummary.overview}
              </p>
            </div>
          )}

          {/* Out of Range Labs */}
          <div>
            <h4 className="font-bold text-slate-200 print:text-black uppercase text-xs tracking-wider mb-2">
              Flagged Out-of-Range Laboratory Findings
            </h4>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-600">
                  <th className="py-1.5 px-2">Test Parameter</th>
                  <th className="py-1.5 px-2">Result</th>
                  <th className="py-1.5 px-2">Reference Range</th>
                  <th className="py-1.5 px-2">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {flaggedLabs.map((l) => (
                  <tr key={l.id}>
                    <td className="py-1.5 px-2 font-semibold text-slate-100 print:text-black">
                      {l.testName}
                    </td>
                    <td className="py-1.5 px-2 font-mono font-bold text-white print:text-black">
                      {l.value} {l.unit}
                    </td>
                    <td className="py-1.5 px-2 text-slate-400 print:text-slate-600 font-mono">
                      {l.canonicalRange || l.refRangeText}
                    </td>
                    <td className="py-1.5 px-2 font-bold text-amber-400 print:text-amber-800">
                      {l.interpretation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Medications */}
          <div>
            <h4 className="font-bold text-slate-200 print:text-black uppercase text-xs tracking-wider mb-2">
              Active Regimen & Discharge Orders
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {record.medications.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300"
                >
                  <strong className="text-slate-100 print:text-black block">
                    {m.drugName} {m.dosage}
                  </strong>
                  <span className="text-slate-400 print:text-slate-600 text-[11px]">
                    Sig: {m.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Safety Notice */}
          <div className="pt-3 border-t border-slate-800 print:border-slate-300 text-[10px] text-slate-400 print:text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-700 shrink-0" />
            <p>
              MedLens is an assistive clinical transcription and organization tool. It does NOT provide medical diagnoses or alter prescriptions. All items must be reviewed by a licensed physician.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
