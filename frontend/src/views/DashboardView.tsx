import React from "react";
import {
  User,
  AlertTriangle,
  FileText,
  FlaskConical,
  Pill,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  PatientProfile,
  MedicalDocument,
  LabObservation,
  Medication,
  ClinicalConflict,
  ActiveScreen,
} from "@/types/clinical";

interface DashboardViewProps {
  patient: PatientProfile;
  documents: MedicalDocument[];
  labs: LabObservation[];
  medications: Medication[];
  conflicts: ClinicalConflict[];
  onNavigate: (screen: ActiveScreen) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patient,
  documents,
  labs,
  medications,
  conflicts,
  onNavigate,
}) => {
  const criticalConflicts = conflicts.filter((c) => c.severity === "CRITICAL");
  const flaggedLabs = labs.filter((l) => l.status === "HIGH" || l.status === "LOW" || l.status === "CRITICAL");
  const pendingLabs = labs.filter((l) => l.verificationStatus === "PENDING");

  return (
    <div className="space-y-6 py-6">
      {/* Patient Profile Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl shadow-inner">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {patient.fullName}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono font-semibold">
                {patient.mrn}
              </span>
              {patient.isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono font-semibold">
                  SYNTHETIC DEMO CASE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {patient.age} years old &bull; {patient.gender} &bull; Blood Group: {patient.bloodGroup} &bull; DOB: {patient.dob}
            </p>
          </div>
        </div>

        {/* Known Allergies Tag & Edit Action */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center md:justify-end gap-1">
              <AlertTriangle className="w-3 h-3" />
              Documented Allergies
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((alg) => (
                  <span
                    key={alg.id}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold"
                  >
                    {alg.substance} ({alg.reaction})
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None reported</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate("intake")}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 self-start md:self-end"
          >
            <span>Edit Intake Info</span>
          </button>
        </div>
      </div>

      {/* User-Provided Intake Summary Strip */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Self-Reported Intake Summary
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-teal-950/80 border border-teal-600/60 text-teal-300 font-mono font-medium">
              USER_PROVIDED
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Captured during intake
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Symptoms */}
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">
              Reported Symptoms
            </span>
            {patient.symptoms && patient.symptoms.length > 0 ? (
              <ul className="space-y-0.5 text-slate-200">
                {patient.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-500 italic">No symptoms entered</span>
            )}
          </div>

          {/* Conditions */}
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">
              Existing Conditions
            </span>
            {patient.conditions && patient.conditions.length > 0 ? (
              <ul className="space-y-0.5 text-slate-200">
                {patient.conditions.map((cond) => (
                  <li key={cond.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    <span>{cond.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-500 italic">No conditions reported</span>
            )}
          </div>

          {/* User-Reported Meds */}
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">
              Reported Medications
            </span>
            {patient.currentMedications && patient.currentMedications.length > 0 ? (
              <ul className="space-y-0.5 text-slate-200 font-mono text-[11px]">
                {patient.currentMedications.map((med, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-500 italic">None reported</span>
            )}
          </div>

          {/* Other Notes */}
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">
              Other Background / Notes
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {patient.otherNotes || "No additional notes provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Conflict Alert Banner */}
      {criticalConflicts.length > 0 && (
        <div
          onClick={() => onNavigate("conflicts")}
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-rose-900/30 to-slate-950 border border-rose-600/80 shadow-lg shadow-rose-950/30 flex items-center justify-between gap-4 cursor-pointer hover:border-rose-500 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white font-bold uppercase tracking-wider">
                Action Required &bull; Conflict Detected
              </span>
              <h4 className="text-sm font-bold text-slate-100 mt-1">
                {criticalConflicts[0].title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {criticalConflicts[0].resolutionLabel} &mdash; Click to review conflicting sources.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* Metric Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Documents */}
        <div
          onClick={() => onNavigate("reports")}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Ingested Reports</span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {documents.length}
          </div>
          <p className="text-[11px] text-teal-400/90 font-medium">
            CBC, CMP, &amp; Prescription Slip
          </p>
        </div>

        {/* Stat 2: Out of Range Labs */}
        <div
          onClick={() => onNavigate("labs")}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Flagged Lab Values</span>
            <FlaskConical className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {flaggedLabs.length}
          </div>
          <p className="text-[11px] text-slate-400">
            HbA1c (8.9%), Creatinine (1.85), Hgb (10.2)
          </p>
        </div>

        {/* Stat 3: Active Medications */}
        <div
          onClick={() => onNavigate("dashboard")}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Prescribed Regimens</span>
            <Pill className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {medications.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Amoxicillin, Metformin, Lisinopril
          </p>
        </div>

        {/* Stat 4: Human Verifications */}
        <div
          onClick={() => onNavigate("labs")}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending HITL Review</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-sky-400 font-mono">
            {pendingLabs.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Confirm, Edit, or Reject extracted data
          </p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => onNavigate("labs")}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 transition cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-sm">Review Structured Labs</span>
            <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-400">
            Inspect source-only reference ranges with UNKNOWN status enforcement.
          </p>
        </div>

        <div
          onClick={() => onNavigate("timeline")}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 transition cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-sm">Chronological Timeline</span>
            <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-400">
            Track historical lab shifts (HbA1c 6.9% &rarr; 8.9%) and report dates.
          </p>
        </div>

        <div
          onClick={() => onNavigate("summary")}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 transition cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-sm">AI Patient Summary</span>
            <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-400">
            Plain-language briefing &amp; questions to ask your physician.
          </p>
        </div>
      </div>
    </div>
  );
};
