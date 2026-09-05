import { Provenance, VerificationStatus, ExtractionEngine } from "./provenance";

export type LabCategory =
  | "HEMATOLOGY"
  | "BIOCHEMISTRY"
  | "LIPID"
  | "DIABETES"
  | "THYROID"
  | "INFLAMMATORY"
  | "CARDIAC"
  | "OTHER";

export type LabInterpretation = "NORMAL" | "LOW" | "HIGH" | "CRITICAL" | "INDETERMINATE";

export interface LabObservation {
  id: string;
  patientId: string;
  documentId: string;
  testName: string;
  category: LabCategory;
  value: string;
  numericValue: number | null;
  unit: string;
  refRangeLow: number | null;
  refRangeHigh: number | null;
  refRangeText: string | null;
  canonicalRange?: string;
  interpretation: LabInterpretation;
  isCritical: boolean;
  provenance: Provenance;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  observedAt: string;
  notes?: string;
}

export type MedicationStatus = "ACTIVE" | "DISCONTINUED" | "HISTORICAL" | "PENDING_REVIEW";

export interface Medication {
  id: string;
  patientId: string;
  documentId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  route: string;
  purpose?: string;
  status: MedicationStatus;
  provenance: Provenance;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  prescribedDate?: string;
  prescribingDoctor?: string;
}

export interface MedicalCondition {
  id: string;
  patientId: string;
  documentId: string;
  conditionName: string;
  icdCode?: string;
  status: "ACTIVE" | "RESOLVED" | "SUSPECTED";
  provenance: Provenance;
  verificationStatus: VerificationStatus;
  firstNotedDate?: string;
}

export type ConflictSeverity = "INFO" | "WARNING" | "CRITICAL";
export type ConflictType =
  | "ALLERGY_MEDICATION_CONFLICT"
  | "MEDICATION_DUPLICATION"
  | "LAB_TREND_ANOMALY"
  | "DOSAGE_UNCERTAINTY"
  | "TEMPORAL_DISCREPANCY";

export interface ClinicalConflict {
  id: string;
  patientId: string;
  type: ConflictType;
  severity: ConflictSeverity;
  title: string;
  description: string;
  clinicalImplication: string;
  suggestedDoctorQuestion: string;
  involvedDocumentIds: string[];
  involvedItems: string[]; // Names of drugs, labs, or allergies
  resolutionStatus: "UNRESOLVED" | "ACKNOWLEDGED" | "DISMISSED";
  detectedAt: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  filename: string;
  fileType: "application/pdf" | "image/png" | "image/jpeg" | "text/plain";
  fileUrl: string;
  documentType: "LAB_REPORT" | "PRESCRIPTION" | "CLINICAL_NOTE" | "DISCHARGE_SUMMARY";
  reportDate: string;
  facilityName: string;
  processingStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  rawText?: string;
  pageCount: number;
  uploadedAt: string;
  isFictionalDemo: boolean; // Explicit flag distinguishing synthetic sample documents
}

export interface PatientSummaryData {
  id: string;
  patientId: string;
  overview: string; // Plain English narrative
  engineUsed: "LIVE_GEMINI_AI" | "PREDEFINED_DEMO_SYNTHESIS"; // Explicitly reveals if AI or static demo synthesis
  plainLanguageLabs: Array<{
    testName: string;
    whatItMeans: string;
    patientStatus: string;
    isOutOfRange: boolean;
  }>;
  questionsForDoctor: Array<{
    id: string;
    question: string;
    context: string;
    priority: "HIGH" | "MEDIUM" | "STANDARD";
  }>;
  clinicianBriefing: {
    chiefIssues: string[];
    criticalValues: string[];
    medicationRegimen: string[];
    discrepancyAlerts: string[];
  };
  safetyDisclaimer: string;
  generatedAt: string;
}

export interface PatientProfile {
  id: string;
  mrn: string;
  fullName: string;
  dob: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  knownAllergies: string[];
  chronicConditions: string[];
  primaryCarePhysician?: string;
  isDemoPatient: boolean; // Explicit flag for synthetic test cases
  createdAt: string;
  updatedAt: string;
}

export interface FullPatientRecord {
  patient: PatientProfile;
  documents: MedicalDocument[];
  observations: LabObservation[];
  medications: Medication[];
  conditions: MedicalCondition[];
  conflicts: ClinicalConflict[];
  latestSummary?: PatientSummaryData;
  isDemoMode: boolean; // Global flag for view
}
