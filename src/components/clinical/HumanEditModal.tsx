"use client";

import React, { useState } from "react";
import { X, Check, Edit3, ShieldAlert } from "lucide-react";
import { LabObservation } from "@/types/clinical";

interface HumanEditModalProps {
  observation: LabObservation | null;
  onClose: () => void;
  onSave: (obsId: string, newValue: string, reason: string) => Promise<void>;
}

export function HumanEditModal({ observation, onClose, onSave }: HumanEditModalProps) {
  if (!observation) return null;

  const [newValue, setNewValue] = useState(observation.value);
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    setIsSaving(true);
    try {
      await onSave(observation.id, newValue.trim(), reason.trim());
      onClose();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Amend Clinical Observation (HITL)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Test Parameter</label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-bold text-slate-200">
              {observation.testName} ({observation.category})
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Original Extracted Value</label>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-400">
                {observation.value} {observation.unit}
              </div>
            </div>

            <div>
              <label className="text-teal-300 font-semibold block mb-1">
                Amended Value *
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-teal-500 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <span className="text-slate-400 font-mono">{observation.unit}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">
              Clinical Justification / Audit Reason
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Typo corrected from smear morphology review, or confirmed with re-run."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 flex items-start gap-2 text-[11px] text-teal-200">
            <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              Modifying this value triggers deterministic re-evaluation of reference ranges and logs an immutable audit trail event with your signature.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition flex items-center gap-1.5 shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Amendment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
