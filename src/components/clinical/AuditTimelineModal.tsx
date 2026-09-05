"use client";

import React from "react";
import { X, History, UserCheck, Sparkles, Edit3, Shield } from "lucide-react";
import { AuditEntry } from "@/types/provenance";

interface AuditTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditEntry[];
}

export function AuditTimelineModal({ isOpen, onClose, auditLogs }: AuditTimelineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Clinical Audit Trail & Provenance Log
              </h3>
              <p className="text-[11px] text-slate-400">
                Verifiable event history of AI extractions and clinical human verifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Entries */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {auditLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No audit records currently available.
            </div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3"
              >
                <div
                  className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                    log.action === "AUTO_EXTRACTED"
                      ? "bg-purple-950/60 text-purple-400 border border-purple-800"
                      : log.action === "USER_VERIFIED"
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                      : "bg-sky-950/60 text-sky-400 border border-sky-800"
                  }`}
                >
                  {log.action === "AUTO_EXTRACTED" ? (
                    <Sparkles className="w-4 h-4" />
                  ) : log.action === "USER_VERIFIED" ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                        {log.entityType}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-400 mt-1">
                    <strong className="text-slate-300 font-medium">Actor:</strong>{" "}
                    {log.performedBy}
                  </p>

                  {log.fieldName && (
                    <p className="text-slate-400 mt-0.5 font-mono text-[11px]">
                      Changed <span className="text-teal-400">{log.fieldName}</span>:{" "}
                      <span className="text-rose-400 line-through">{log.oldValue}</span> &rarr;{" "}
                      <span className="text-emerald-400 font-bold">{log.newValue}</span>
                    </p>
                  )}

                  {log.reason && (
                    <p className="text-slate-400 italic mt-1 text-[11px]">
                      Reason: &quot;{log.reason}&quot;
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            Immutable Audit Trail Enabled
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
