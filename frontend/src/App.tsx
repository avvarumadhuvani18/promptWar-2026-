import React, { useState } from "react";
import { SafetyBar } from "@/components/layout/SafetyBar";
import { Navbar } from "@/components/layout/Navbar";
import { LandingView } from "@/views/LandingView";
import { PatientIntakeView } from "@/views/PatientIntakeView";
import { ReportUploadView } from "@/views/ReportUploadView";
import { ProcessingView } from "@/views/ProcessingView";
import { DashboardView } from "@/views/DashboardView";
import { ReportsView } from "@/views/ReportsView";
import { LabResultsView } from "@/views/LabResultsView";
import { TimelineView } from "@/views/TimelineView";
import { ConflictsView } from "@/views/ConflictsView";
import { SummaryView } from "@/views/SummaryView";
import {
  ActiveScreen,
  PatientProfile,
  MedicalDocument,
  LabObservation,
  Medication,
  ClinicalConflict,
  TimelineEvent,
  AISummary,
} from "@/types/clinical";
import {
  DEMO_PATIENT,
  DEMO_DOCUMENTS,
  DEMO_LABS,
  DEMO_MEDICATIONS,
  DEMO_CONFLICTS,
  DEMO_TIMELINE,
  DEMO_SUMMARY,
} from "@/services/demoData";

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>("landing");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // State with localStorage hydration
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const stored = localStorage.getItem("medlens_patient_profile");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn("Failed to load patient from localStorage:", err);
    }
    return DEMO_PATIENT;
  });

  const [documents, setDocuments] = useState<MedicalDocument[]>(DEMO_DOCUMENTS);
  const [labs, setLabs] = useState<LabObservation[]>(DEMO_LABS);
  const [medications, setMedications] = useState<Medication[]>(DEMO_MEDICATIONS);
  const [conflicts, setConflicts] = useState<ClinicalConflict[]>(DEMO_CONFLICTS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(DEMO_TIMELINE);
  const [summary, setSummary] = useState<AISummary>(DEMO_SUMMARY);

  // Provenance viewer state
  const [highlightSnippet, setHighlightSnippet] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined);

  // Update patient handler
  const handleUpdatePatient = (updated: PatientProfile) => {
    setPatient(updated);
    try {
      localStorage.setItem("medlens_patient_profile", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to save patient to localStorage:", err);
    }
  };

  // Load / Reset Demo
  const handleLoadDemo = () => {
    const freshDemo = JSON.parse(JSON.stringify(DEMO_PATIENT));
    setPatient(freshDemo);
    try {
      localStorage.setItem("medlens_patient_profile", JSON.stringify(freshDemo));
    } catch (err) {
      console.warn("Failed to clear localStorage:", err);
    }
    setDocuments(JSON.parse(JSON.stringify(DEMO_DOCUMENTS)));
    setLabs(JSON.parse(JSON.stringify(DEMO_LABS)));
    setMedications(JSON.parse(JSON.stringify(DEMO_MEDICATIONS)));
    setConflicts(JSON.parse(JSON.stringify(DEMO_CONFLICTS)));
    setTimeline(JSON.parse(JSON.stringify(DEMO_TIMELINE)));
    setSummary(JSON.parse(JSON.stringify(DEMO_SUMMARY)));
    setIsDemoMode(true);
    setCurrentScreen("dashboard");
  };

  // Human Verification Handler
  const handleVerifyLab = (
    id: string,
    action: "CONFIRM" | "EDIT" | "REJECT",
    editedValue?: string
  ) => {
    setLabs((prev) =>
      prev.map((lab) => {
        if (lab.id !== id) return lab;
        if (action === "CONFIRM") {
          return {
            ...lab,
            verificationStatus: "CONFIRMED",
            verifiedBy: "Clinician Reviewer",
            verifiedAt: new Date().toISOString(),
          };
        }
        if (action === "REJECT") {
          return {
            ...lab,
            verificationStatus: "REJECTED",
            verifiedBy: "Clinician Reviewer",
            verifiedAt: new Date().toISOString(),
          };
        }
        if (action === "EDIT" && editedValue) {
          return {
            ...lab,
            rawValue: editedValue,
            numericValue: parseFloat(editedValue) || lab.numericValue,
            verificationStatus: "EDITED",
            verifiedBy: "Clinician Reviewer (Amended)",
            verifiedAt: new Date().toISOString(),
          };
        }
        return lab;
      })
    );
  };

  // Provenance viewer jump
  const handleViewSource = (snippet: string, docId: string) => {
    setHighlightSnippet(snippet);
    setSelectedDocumentId(docId);
    setCurrentScreen("reports");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Top Safety Bar */}
      <SafetyBar isDemoMode={isDemoMode} />

      {/* Main Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLoadDemo={handleLoadDemo}
        patientName={patient.fullName}
        isDemo={isDemoMode}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
        {currentScreen === "landing" && (
          <LandingView onNavigate={setCurrentScreen} onLoadDemo={handleLoadDemo} />
        )}

        {currentScreen === "intake" && (
          <PatientIntakeView
            patient={patient}
            onUpdatePatient={handleUpdatePatient}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === "upload" && (
          <ReportUploadView
            documents={documents}
            onNavigate={setCurrentScreen}
            onStartProcessing={() => setCurrentScreen("processing")}
          />
        )}

        {currentScreen === "processing" && (
          <ProcessingView onComplete={() => setCurrentScreen("dashboard")} />
        )}

        {currentScreen === "dashboard" && (
          <DashboardView
            patient={patient}
            documents={documents}
            labs={labs}
            medications={medications}
            conflicts={conflicts}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === "reports" && (
          <ReportsView
            documents={documents}
            selectedDocumentId={selectedDocumentId}
            highlightSnippet={highlightSnippet}
          />
        )}

        {currentScreen === "labs" && (
          <LabResultsView
            labs={labs}
            onVerify={handleVerifyLab}
            onViewSource={handleViewSource}
          />
        )}

        {currentScreen === "timeline" && <TimelineView events={timeline} />}

        {currentScreen === "conflicts" && <ConflictsView conflicts={conflicts} />}

        {currentScreen === "summary" && <SummaryView summary={summary} />}
      </main>

      {/* Persistent Clinical System Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          MedLens AI &bull; Clinical Information Intelligence &bull; Hackathon Edition 2026 &bull; Strict Source Provenance
        </p>
      </footer>
    </div>
  );
};
