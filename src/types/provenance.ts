export type VerificationStatus = "EXTRACTED" | "VERIFIED" | "EDITED";

export type ExtractionEngine =
  | "LIVE_GEMINI_AI"
  | "PREDEFINED_DEMO_DATASET"
  | "MANUAL_USER_INPUT";

export interface Provenance {
  documentId: string;
  documentName: string;
  pageNumber: number;
  sourceSnippet: string;
  confidenceScore: number; // 0.0 - 1.0
  extractionEngine: ExtractionEngine; // Explicitly distinguishes real Gemini AI extraction vs Predefined Demo Dataset
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AuditEntry {
  id: string;
  entityId: string;
  entityType: "OBSERVATION" | "MEDICATION" | "CONDITION" | "DOCUMENT";
  action: "AUTO_EXTRACTED" | "USER_VERIFIED" | "USER_EDITED" | "STATUS_CHANGED";
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: string; // e.g., "Live AI (Gemini 2.0 Flash)" | "Predefined Fictional Demo Dataset" | "User Verification"
  timestamp: string;
  reason?: string;
}
