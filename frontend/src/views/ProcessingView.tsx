import React, { useState, useEffect } from "react";
import {
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { ActiveScreen } from "@/types/clinical";

interface ProcessingViewProps {
  onComplete: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(20);

  const steps = [
    {
      id: 1,
      title: "Document Ingestion & Text Extraction",
      desc: "Parsing PDF binary streams and extracting verbatim character sequences.",
      icon: <FileSearch className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 2,
      title: "Gemini Structured Entity Extraction",
      desc: "Extracting lab tests, units, values, medications, and line-level provenance snippets.",
      icon: <Cpu className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 3,
      title: "Strict Reference-Range Evaluation",
      desc: "Checking report-printed reference bounds. Explicitly marking unprinted ranges as UNKNOWN.",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 4,
      title: "Cross-Document Conflict Scan",
      desc: "Evaluating documented penicillin allergy against prescribed beta-lactam orders.",
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 5,
      title: "Clinical Synthesis & Timeline Compilation",
      desc: "Assembling patient-friendly explanation and chronological clinical trajectory.",
      icon: <Sparkles className="w-4 h-4 text-teal-400" />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 5) {
          setProgress((p) => p + 20);
          return prev + 1;
        }
        clearInterval(timer);
        return 5;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-900/20 animate-pulse">
          <Cpu className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Processing Medical Intelligence Pipeline
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Extracting structured clinical entities, evaluating strict source ranges, and mapping complete provenance.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Overall Pipeline Progress</span>
          <span className="text-teal-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pipeline Steps Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
        {steps.map((step) => {
          const isDone = currentStep > step.id || currentStep === 5;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                isDone
                  ? "bg-slate-950/60 border-emerald-900/40 text-slate-300"
                  : isCurrent
                  ? "bg-slate-950 border-teal-500/60 shadow-lg shadow-teal-950/20"
                  : "bg-slate-950/30 border-slate-800/60 opacity-50"
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold ${isCurrent ? "text-white text-sm" : "text-slate-200"}`}>
                    {step.title}
                  </h4>
                  {isDone && (
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                      COMPLETE
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] text-teal-400 font-mono font-semibold animate-pulse">
                      PROCESSING...
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance Button */}
      <div className="text-center pt-2">
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-950/40 transition flex items-center gap-2 mx-auto"
        >
          <span>View Consolidated Patient Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
