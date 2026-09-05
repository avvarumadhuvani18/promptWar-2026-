import React, { useState } from "react";
import {
  FlaskConical,
  CheckCircle,
  Edit3,
  XCircle,
  FileSearch,
  AlertTriangle,
  HelpCircle,
  Filter,
} from "lucide-react";
import { LabObservation, RangeStatus, VerificationStatus } from "@/types/clinical";

interface LabResultsViewProps {
  labs: LabObservation[];
  onVerify: (id: string, action: "CONFIRM" | "EDIT" | "REJECT", editedValue?: string) => void;
  onViewSource: (snippet: string, docId: string) => void;
}

export const LabResultsView: React.FC<LabResultsViewProps> = ({
  labs,
  onVerify,
  onViewSource,
}) => {
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const categories = ["ALL", "DIABETES", "BIOCHEMISTRY", "HEMATOLOGY"];

  const filtered = labs.filter((l) => {
    if (filterCat === "ALL") return true;
    return l.category === filterCat;
  });

  const getStatusBadge = (status: RangeStatus) => {
    switch (status) {
      case "HIGH":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-950/80 text-orange-300 border border-orange-700/60">
            HIGH
          </span>
        );
      case "LOW":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">
            LOW
          </span>
        );
      case "NORMAL":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            NORMAL
          </span>
        );
      case "CRITICAL":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse">
            CRITICAL
          </span>
        );
      case "UNKNOWN":
      default:
        return (
          <span
            title="Source document did not provide reference limits. MedLens never invents ranges."
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 font-mono inline-flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            UNKNOWN
          </span>
        );
    }
  };

  const getVerificationBadge = (vStatus: VerificationStatus) => {
    switch (vStatus) {
      case "CONFIRMED":
        return (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80 inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "EDITED":
        return (
          <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/80 inline-flex items-center gap-1">
            <Edit3 className="w-3 h-3" />
            Amended
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/80 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Pending Review
          </span>
        );
    }
  };

  const handleStartEdit = (lab: LabObservation) => {
    setEditingId(lab.id);
    setEditValue(lab.rawValue);
  };

  const handleSaveEdit = (id: string) => {
    onVerify(id, "EDIT", editValue);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-teal-400" />
            <span>Structured Laboratory Observations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict Source-Only Reference Ranges &bull; Three-Way Human Review (Confirm, Edit, Reject).
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterCat === cat
                  ? "bg-teal-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice Callout on Ranges */}
      <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-700/40 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Strict Safety Requirement Enforced:</strong> Reference ranges are derived solely from the printed source document. Where no reference interval was provided on the original lab slip, MedLens explicitly assigns <span className="font-mono font-bold text-amber-300">UNKNOWN</span> rather than inventing reference bounds.
        </p>
      </div>

      {/* Structured Labs Table Card */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3 px-4">Test Parameter</th>
                <th className="py-3 px-4">Observed Value</th>
                <th className="py-3 px-4">Reported Range</th>
                <th className="py-3 px-4">Interpretation</th>
                <th className="py-3 px-4">Provenance</th>
                <th className="py-3 px-4 text-right">Human Verification (HITL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((lab) => {
                const isEditing = editingId === lab.id;

                return (
                  <tr key={lab.id} className="hover:bg-slate-900/40 transition">
                    {/* Test Parameter */}
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <div>{lab.testName}</div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {lab.category} &bull; {lab.observedAt}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-sm text-slate-100">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 p-1 bg-slate-900 border border-teal-500 rounded text-xs text-white"
                          />
                          <button
                            onClick={() => handleSaveEdit(lab.id)}
                            className="p-1 bg-teal-600 rounded text-white"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span>
                          {lab.rawValue} <span className="text-xs text-slate-400 font-normal">{lab.unit}</span>
                        </span>
                      )}
                    </td>

                    {/* Reported Range */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {lab.reportedRefText || (
                        <span className="text-slate-500 italic">None provided on report</span>
                      )}
                    </td>

                    {/* Interpretation */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(lab.status)}
                    </td>

                    {/* Provenance */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onViewSource(lab.provenance.sourceSnippet || "", lab.documentId)}
                        title="Click to view line snippet in source viewer"
                        className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-mono transition"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>p.{lab.provenance.pageNumber}</span>
                      </button>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {lab.provenance.type}
                      </div>
                    </td>

                    {/* Actions: Confirm, Edit, Reject */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {getVerificationBadge(lab.verificationStatus)}

                        {lab.verificationStatus !== "CONFIRMED" && (
                          <button
                            onClick={() => onVerify(lab.id, "CONFIRM")}
                            title="Confirm extracted value as accurate"
                            className="p-1 rounded bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-600 text-slate-300 hover:text-emerald-300 transition"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleStartEdit(lab)}
                          title="Edit extracted value"
                          className="p-1 rounded bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-600 text-slate-300 hover:text-sky-300 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {lab.verificationStatus !== "REJECTED" && (
                          <button
                            onClick={() => onVerify(lab.id, "REJECT")}
                            title="Reject extracted value"
                            className="p-1 rounded bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-600 text-slate-300 hover:text-rose-300 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
