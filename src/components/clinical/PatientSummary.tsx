"use client";

import React, { useState } from "react";
import {
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Stethoscope,
  User,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { PatientSummaryData } from "@/types/clinical";

interface PatientSummaryProps {
  summary?: PatientSummaryData;
  onRefreshSummary?: () => void;
  isLoading?: boolean;
}

export function PatientSummary({
  summary,
  onRefreshSummary,
  isLoading = false,
}: PatientSummaryProps) {
  const [activeTab, setActiveTab] = useState<"PATIENT" | "CLINICIAN">("PATIENT");
  const [copied, setCopied] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  if (!summary) {
    return (
      <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center">
        <Sparkles className="w-8 h-8 text-teal-400 mx-auto mb-2 opacity-80" />
        <h3 className="text-sm font-bold text-slate-200">Clinical Summary Not Generated</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
          Synthesize extracted lab parameters, medications, and conflicts into an understandable patient guide and clinician briefing.
        </p>
        <button
          onClick={onRefreshSummary}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition"
        >
          {isLoading ? "Generating Summary..." : "Generate AI Summary"}
        </button>
      </div>
    );
  }

  const handleCopyQuestions = () => {
    const text = summary.questionsForDoctor
      .map((q, idx) => `${idx + 1}. ${q.question} (Context: ${q.context})`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleQuestion = (id: string) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Header & Mode Badges */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">
                AI Clinical Synthesis & Doctor Briefing
              </h3>
              {/* Engine Transparency Indicator */}
              {summary.engineUsed === "PREDEFINED_DEMO_SYNTHESIS" ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 font-medium">
                  Predefined Demo Synthesis
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-medium">
                  Live Gemini AI
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Strict Non-Diagnostic Assistive Translation
            </p>
          </div>
        </div>

        {/* Audience Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("PATIENT")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === "PATIENT"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Friendly</span>
          </button>

          <button
            onClick={() => setActiveTab("CLINICIAN")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === "CLINICIAN"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinician SBAR</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Patient-Friendly Overview */}
      {activeTab === "PATIENT" && (
        <div className="p-5 space-y-5">
          {/* Plain English Narrative */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>What Your Medical Records Show (Plain Language)</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {summary.overview}
            </p>
          </div>

          {/* Plain Language Lab Explanations */}
          {summary.plainLanguageLabs && summary.plainLanguageLabs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Key Test Explanations (What the Numbers Mean)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summary.plainLanguageLabs.map((lab, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs ${
                      lab.isOutOfRange
                        ? "bg-amber-950/20 border-amber-600/40"
                        : "bg-slate-900/40 border-slate-800"
                    }`}
                  >
                    <div className="font-bold text-slate-100 flex items-center justify-between">
                      <span>{lab.testName}</span>
                      {lab.isOutOfRange && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 font-normal">
                          Requires Discussion
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] mt-1">
                      <strong className="text-slate-400">Function:</strong> {lab.whatItMeans}
                    </p>
                    <p className="text-teal-300/90 text-[11px] mt-1">
                      <strong className="text-slate-400">Your Reading:</strong> {lab.patientStatus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions for Doctor */}
          {summary.questionsForDoctor && summary.questionsForDoctor.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Recommended Questions for Your Next Doctor Appointment
                  </h4>
                </div>
                <button
                  onClick={handleCopyQuestions}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium transition border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied to Clipboard!" : "Copy Questions"}</span>
                </button>
              </div>

              <div className="space-y-2">
                {summary.questionsForDoctor.map((q) => {
                  const isChecked = checkedQuestions[q.id];
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestion(q.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? "bg-slate-900/30 border-slate-800 opacity-60 line-through"
                          : "bg-slate-900/70 border-slate-800 hover:border-teal-500/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition ${
                          isChecked
                            ? "bg-teal-600 border-teal-500 text-white"
                            : "border-slate-600 bg-slate-950"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-100">
                            {q.question}
                          </span>
                          {q.priority === "HIGH" && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold uppercase shrink-0">
                              High Priority
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          Why this is relevant: {q.context}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Clinician SBAR Briefing */}
      {activeTab === "CLINICIAN" && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chief Issues */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                Chief Clinical Trajectory
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {summary.clinicianBriefing.chiefIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Values & Alerts */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                Immediate Actionable Conflicts
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200">
                {summary.clinicianBriefing.criticalValues.map((val, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Medication Regimen */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Documented Medication Regimen
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {summary.clinicianBriefing.medicationRegimen.map((med, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discrepancy Alerts */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Cross-Document Discordances
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200">
                {summary.clinicianBriefing.discrepancyAlerts.map((disc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{disc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="px-5 py-3 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
        <span>{summary.safetyDisclaimer}</span>
      </div>
    </div>
  );
}
