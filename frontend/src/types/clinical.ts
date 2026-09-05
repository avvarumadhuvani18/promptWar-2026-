export type ProvenanceType =
  | "USER_PROVIDED"
  | "SOURCE"
  | "AI_EXTRACTED"
  | "AI_GENERATED"
  | "HUMAN_VERIFIED";

export type RangeStatus = "NORMAL" | "LOW" | "HIGH" | "CRITICAL" | "UNKNOWN";

export type VerificationStatus = "PENDING" | "CONFIRMED" | "EDITED" | "REJECTED";

export type ActiveScreen =
  | "landing"
  | "intake"
  | "upload"
  | "processing"
  | "dashboard"
  | "reports"
  | "labs"
  | "timeline"
  | "conflicts"
  | "summary";

export interface ProvenanceMeta {
  type: ProvenanceType;
  documentId?: string;
  documentName?: string;
  pageNumber?: number;
  sourceSnippet?: string;
  timestamp: string;
  confidence?: number; // 0.0 - 1.0
}

export interface PatientAllergy {
  id: string;
  substance: string;
  reaction: string;
  severity: "Severe" | "Moderate" | "Mild";
  provenanceType: ProvenanceType;
}

export interface PatientCondition {
  id: string;
  name: string;
  status: "ACTIVE" | "RESOLVED";
  provenanceType: ProvenanceType;
}

export interface PatientProfile {
  id: string;
  mrn: string;
  fullName: string;
  dob: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  bloodGroup: string;
  symptoms?: string[];
  allergies: PatientAllergy[];
  conditions: PatientCondition[];
  currentMedications?: string[];
  otherNotes?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  filename: string;
  fileType: string;
  documentType: "LAB_REPORT" | "PRESCRIPTION" | "CLINICAL_NOTE";
  reportDate: string;
  facilityName: string;
  rawText: string;
  isDemo: boolean;
  uploadedAt: string;
}

export interface LabObservation {
  id: string;
  patientId: string;
  documentId: string;
  testName: string;
  category: "DIABETES" | "BIOCHEMISTRY" | "HEMATOLOGY" | "LIPID" | "OTHER";
  rawValue: string;
  numericValue: number | null;
  unit: string;
  reportedRefLow: number | null;
  reportedRefHigh: number | null;
  reportedRefText: string | null;
  status: RangeStatus; // STRICT: If no range in report, must be "UNKNOWN"
  provenance: ProvenanceMeta;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  editReason?: string;
  observedAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  documentId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  route: string;
  status: "ACTIVE" | "DISCONTINUED";
  provenance: ProvenanceMeta;
  verificationStatus: VerificationStatus;
  prescribedDate?: string;
}

export interface ClinicalConflict {
  id: string;
  patientId: string;
  conflictType: "ALLERGY_MEDICATION" | "LAB_DISCREPANCY" | "TEMPORAL_INCONSISTENCY";
  severity: "CRITICAL" | "WARNING";
  title: string;
  description: string;
  valueA: string;
  sourceA: string;
  valueB: string;
  sourceB: string;
  resolutionLabel: "Requires human verification"; // NEVER decide which is correct!
  suggestedDoctorQuestion: string;
  status: "UNRESOLVED" | "RESOLVED" | "DISMISSED";
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  eventType: "REPORT_FILED" | "LAB_FLAGGED" | "MEDICATION_ORDERED" | "VERIFICATION_LOGGED";
  title: string;
  description: string;
  sourceDocumentName?: string;
  badgeColor?: string;
  highlightValue?: string;
}

export interface AISummary {
  patientId: string;
  overview: string;
  plainLanguageLabs: Array<{
    testName: string;
    whatItMeans: string;
    patientStatus: string;
  }>;
  questionsForDoctor: Array<{
    id: string;
    question: string;
    reason: string;
    priority: "HIGH" | "MEDIUM";
  }>;
  isDemo: boolean;
  generatedAt: string;
}
