import React from "react";
import {
  Activity,
  ShieldCheck,
  FileSearch,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { ActiveScreen } from "@/types/clinical";

interface LandingViewProps {
  onNavigate: (screen: ActiveScreen) => void;
  onLoadDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onLoadDemo }) => {
  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>MedLens Clinical Intelligence System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Transform Fragmented Medical Data into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
              Traceable, Verifiable Clinical Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Medical information is scattered across patient memories, paper prescriptions, laboratory PDFs, and discharge orders. MedLens structures fragmented data, enforces strict source-only reference ranges, surfaces clinical conflicts, and provides end-to-end provenance.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onLoadDemo}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-teal-950/40 transition flex items-center gap-2 group"
            >
              <span>Explore Fictional Demo Case (Eleanor Vance)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("intake")}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
            >
              Start New Patient Intake
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <FileSearch className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Five-Tier Provenance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every clinical observation, medication, and allergy tracks its exact origin: <code className="text-teal-300 font-mono">USER_PROVIDED</code>, <code className="text-teal-300 font-mono">SOURCE</code>, <code className="text-teal-300 font-mono">AI_EXTRACTED</code>, <code className="text-teal-300 font-mono">AI_GENERATED</code>, or <code className="text-teal-300 font-mono">HUMAN_VERIFIED</code>.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Strict Reference-Range Rule</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reference ranges are evaluated <em>only</em> if explicitly stated in the source report. If the report omits a reference interval, status is strictly labeled <code className="text-amber-300 font-mono">UNKNOWN</code> &mdash; never invented.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Unbiased Conflict Detection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When discrepancies appear (e.g. documented Penicillin allergy vs Amoxicillin prescription), MedLens shows both opposing sources and flags <code className="text-rose-300 font-mono">Requires human verification</code> without guessing.
          </p>
        </div>
      </div>

      {/* Safety Non-Diagnostic Guarantee */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3.5 text-xs text-slate-400">
        <Lock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-200 text-sm">Regulatory &amp; Safety Compliance</h4>
          <p className="leading-relaxed">
            MedLens is an information organization and review system. It never diagnoses a disease, prescribes medication, recommends treatment, or adjusts dosages. All clinical data is subject to human clinician confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};
