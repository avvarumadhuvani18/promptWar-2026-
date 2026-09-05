import {
  PatientProfile,
  MedicalDocument,
  LabObservation,
  Medication,
  ClinicalConflict,
  TimelineEvent,
  AISummary,
} from "@/types/clinical";

export const DEMO_PATIENT: PatientProfile = {
  id: "pat-eleanor-vance-demo",
  mrn: "MRN-90281-DEMO",
  fullName: "Eleanor Vance",
  dob: "1964-03-15",
  age: 62,
  gender: "Female",
  bloodGroup: "A+",
  allergies: [
    {
      id: "alg-1",
      substance: "Penicillin",
      reaction: "Severe Anaphylaxis / Urticarial Rash",
      severity: "Severe",
      provenanceType: "USER_PROVIDED",
    },
    {
      id: "alg-2",
      substance: "Sulfa Antibiotics",
      reaction: "Maculopapular Rash",
      severity: "Moderate",
      provenanceType: "USER_PROVIDED",
    },
  ],
  conditions: [
    {
      id: "cond-1",
      name: "Type 2 Diabetes Mellitus",
      status: "ACTIVE",
      provenanceType: "USER_PROVIDED",
    },
    {
      id: "cond-2",
      name: "Essential Hypertension",
      status: "ACTIVE",
      provenanceType: "USER_PROVIDED",
    },
  ],
  symptoms: ["Fatigue (recent worsening)", "Mild lower extremity edema", "Localized dental molar throbbing"],
  currentMedications: ["Metformin 1000mg BID", "Lisinopril 20mg Daily", "Atorvastatin 40mg Bedtime"],
  otherNotes: "Patient reports routine compliance with diabetic medications; reports toothache began 3 days ago.",
  isDemo: true,
  createdAt: "2026-06-12T08:00:00Z",
};

export const DEMO_DOCUMENTS: MedicalDocument[] = [
  {
    id: "doc-cmp-2026",
    patientId: "pat-eleanor-vance-demo",
    filename: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
    fileType: "application/pdf",
    documentType: "LAB_REPORT",
    reportDate: "2026-06-12",
    facilityName: "Metro General Pathology Laboratories",
    isDemo: true,
    uploadedAt: "2026-06-12T10:15:00Z",
    rawText: `METRO GENERAL PATHOLOGY LABORATORIES
742 Evergreen Terrace, Suite 400 | CAP Accredited #829103
PATIENT: Eleanor Vance | DOB: 03/15/1964 | MRN: 90281-DEMO
COLLECTED: 06/12/2026 07:30 AM | SPECIMEN: Serum

TEST NAME                     RESULT      UNITS      REPORTED REF RANGE
-----------------------------------------------------------------------
Fasting Blood Glucose         168         mg/dL      70 - 99
Hemoglobin A1c (HbA1c)        8.9         %          4.0 - 5.6
Serum Creatinine              1.85        mg/dL      0.60 - 1.20
Blood Urea Nitrogen (BUN)     28          mg/dL      7 - 20
eGFR (CKD-EPI)                38          mL/min     > 60
Serum Potassium               4.6         mmol/L     3.5 - 5.1
Serum Sodium                  139         mmol/L     135 - 145
Total Cholesterol             218         mg/dL      125 - 200
Triglycerides                 195         mg/dL      50 - 150
HDL Cholesterol               44          mg/dL      > 50
LDL Cholesterol               135         mg/dL      < 100
Urine Albumin/Creatinine      --          mg/g       (Range not provided on sheet)
-----------------------------------------------------------------------
COMMENTS: Marked elevation of HbA1c (8.9%). Worsening of renal profile (Creatinine 1.85).`,
  },
  {
    id: "doc-cbc-2026",
    patientId: "pat-eleanor-vance-demo",
    filename: "MetroGen_Complete_Blood_Count_June2026.pdf",
    fileType: "application/pdf",
    documentType: "LAB_REPORT",
    reportDate: "2026-06-12",
    facilityName: "Metro General Pathology Laboratories",
    isDemo: true,
    uploadedAt: "2026-06-12T10:16:00Z",
    rawText: `METRO GENERAL PATHOLOGY LABORATORIES
AUTOMATED HEMATOLOGY (CBC)
PATIENT: Eleanor Vance | DOB: 03/15/1964

TEST NAME                     RESULT      UNITS          REPORTED REF RANGE
---------------------------------------------------------------------------
White Blood Cells (WBC)       6.8         x10^3/uL       4.5 - 11.0
Red Blood Cells (RBC)         3.62        x10^6/uL       4.00 - 5.40
Hemoglobin (Hgb)              10.2        g/dL           12.0 - 16.0
Hematocrit (Hct)              31.4        %              36.0 - 48.0
MCV                           78.5        fL             80.0 - 100.0
Platelet Count                215         x10^3/uL       150 - 450
RDW-CV                        16.2        %              11.5 - 14.5
---------------------------------------------------------------------------
MORPHOLOGY: Mild microcytosis and hypochromasia. Suggests iron deficiency.`,
  },
  {
    id: "doc-rx-2026",
    patientId: "pat-eleanor-vance-demo",
    filename: "StJude_Clinic_Discharge_Prescription_July2026.pdf",
    fileType: "application/pdf",
    documentType: "PRESCRIPTION",
    reportDate: "2026-07-04",
    facilityName: "St. Jude Ambulatory Clinic",
    isDemo: true,
    uploadedAt: "2026-07-04T14:30:00Z",
    rawText: `ST. JUDE AMBULATORY CLINIC
DISCHARGE ORDERS & PRESCRIPTION
PATIENT: Eleanor Vance | Date: 07/04/2026

Rx 1: Amoxicillin 500mg capsule
      Sig: Take 1 capsule TID for 7 days for dental abscess prophylaxis.
Rx 2: Metformin 1000mg tablet
      Sig: Take 1 tablet BID with meals.
Rx 3: Lisinopril 20mg tablet
      Sig: Take 1 tablet daily in the morning.
Rx 4: Atorvastatin 40mg tablet
      Sig: Take 1 tablet daily at bedtime.`,
  },
];

export const DEMO_LABS: LabObservation[] = [
  {
    id: "lab-1",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cmp-2026",
    testName: "Fasting Blood Glucose",
    category: "DIABETES",
    rawValue: "168",
    numericValue: 168,
    unit: "mg/dL",
    reportedRefLow: 70,
    reportedRefHigh: 99,
    reportedRefText: "70 - 99 mg/dL",
    status: "HIGH",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cmp-2026",
      documentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Fasting Blood Glucose         168         mg/dL      70 - 99",
      timestamp: "2026-06-12T10:15:00Z",
      confidence: 0.98,
    },
    verificationStatus: "CONFIRMED",
    verifiedBy: "Dr. Jenkins (PCP)",
    verifiedAt: "2026-06-12T11:00:00Z",
    observedAt: "2026-06-12",
  },
  {
    id: "lab-2",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cmp-2026",
    testName: "Hemoglobin A1c (HbA1c)",
    category: "DIABETES",
    rawValue: "8.9",
    numericValue: 8.9,
    unit: "%",
    reportedRefLow: 4.0,
    reportedRefHigh: 5.6,
    reportedRefText: "4.0 - 5.6 %",
    status: "HIGH",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cmp-2026",
      documentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Hemoglobin A1c (HbA1c)        8.9         %          4.0 - 5.6",
      timestamp: "2026-06-12T10:15:00Z",
      confidence: 0.99,
    },
    verificationStatus: "CONFIRMED",
    verifiedBy: "Dr. Jenkins (PCP)",
    observedAt: "2026-06-12",
  },
  {
    id: "lab-3",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cmp-2026",
    testName: "Serum Creatinine",
    category: "BIOCHEMISTRY",
    rawValue: "1.85",
    numericValue: 1.85,
    unit: "mg/dL",
    reportedRefLow: 0.60,
    reportedRefHigh: 1.20,
    reportedRefText: "0.60 - 1.20 mg/dL",
    status: "HIGH",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cmp-2026",
      documentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Serum Creatinine              1.85        mg/dL      0.60 - 1.20",
      timestamp: "2026-06-12T10:15:00Z",
      confidence: 0.97,
    },
    verificationStatus: "PENDING",
    observedAt: "2026-06-12",
  },
  {
    id: "lab-4",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cmp-2026",
    testName: "eGFR",
    category: "BIOCHEMISTRY",
    rawValue: "38",
    numericValue: 38,
    unit: "mL/min",
    reportedRefLow: 60,
    reportedRefHigh: 120,
    reportedRefText: "> 60 mL/min",
    status: "LOW",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cmp-2026",
      documentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "eGFR (CKD-EPI)                38          mL/min     > 60",
      timestamp: "2026-06-12T10:15:00Z",
      confidence: 0.96,
    },
    verificationStatus: "PENDING",
    observedAt: "2026-06-12",
  },
  {
    id: "lab-5",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cbc-2026",
    testName: "Hemoglobin (Hgb)",
    category: "HEMATOLOGY",
    rawValue: "10.2",
    numericValue: 10.2,
    unit: "g/dL",
    reportedRefLow: 12.0,
    reportedRefHigh: 16.0,
    reportedRefText: "12.0 - 16.0 g/dL",
    status: "LOW",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cbc-2026",
      documentName: "MetroGen_Complete_Blood_Count_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Hemoglobin (Hgb)              10.2        g/dL           12.0 - 16.0",
      timestamp: "2026-06-12T10:16:00Z",
      confidence: 0.99,
    },
    verificationStatus: "PENDING",
    observedAt: "2026-06-12",
  },
  {
    id: "lab-6",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cmp-2026",
    testName: "Serum Potassium",
    category: "BIOCHEMISTRY",
    rawValue: "4.6",
    numericValue: 4.6,
    unit: "mmol/L",
    reportedRefLow: 3.5,
    reportedRefHigh: 5.1,
    reportedRefText: "3.5 - 5.1 mmol/L",
    status: "NORMAL",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cmp-2026",
      documentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Serum Potassium               4.6         mmol/L     3.5 - 5.1",
      timestamp: "2026-06-12T10:15:00Z",
      confidence: 0.98,
    },
    verificationStatus: "CONFIRMED",
    observedAt: "2026-06-12",
  },
  {
    id: "lab-7",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-cmp-2026",
    testName: "Urine Albumin/Creatinine",
    category: "BIOCHEMISTRY",
    rawValue: "Pending",
    numericValue: null,
    unit: "mg/g",
    reportedRefLow: null,
    reportedRefHigh: null,
    reportedRefText: null, // STRICT RULE TEST: No range provided -> UNKNOWN!
    status: "UNKNOWN",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-cmp-2026",
      documentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Urine Albumin/Creatinine      --          mg/g       (Range not provided on sheet)",
      timestamp: "2026-06-12T10:15:00Z",
      confidence: 0.85,
    },
    verificationStatus: "PENDING",
    observedAt: "2026-06-12",
  },
];

export const DEMO_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-rx-2026",
    drugName: "Amoxicillin",
    dosage: "500 mg",
    frequency: "1 capsule TID for 7 days",
    route: "Oral",
    status: "ACTIVE",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-rx-2026",
      documentName: "StJude_Clinic_Discharge_Prescription_July2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Rx 1: Amoxicillin 500mg capsule\n      Sig: Take 1 capsule TID for 7 days for dental abscess prophylaxis.",
      timestamp: "2026-07-04T14:30:00Z",
      confidence: 0.99,
    },
    verificationStatus: "PENDING",
    prescribedDate: "2026-07-04",
  },
  {
    id: "med-2",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-rx-2026",
    drugName: "Metformin",
    dosage: "1000 mg",
    frequency: "1 tablet BID with meals",
    route: "Oral",
    status: "ACTIVE",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-rx-2026",
      documentName: "StJude_Clinic_Discharge_Prescription_July2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Rx 2: Metformin 1000mg tablet\n      Sig: Take 1 tablet BID with meals.",
      timestamp: "2026-07-04T14:30:00Z",
      confidence: 0.98,
    },
    verificationStatus: "CONFIRMED",
    prescribedDate: "2026-07-04",
  },
  {
    id: "med-3",
    patientId: "pat-eleanor-vance-demo",
    documentId: "doc-rx-2026",
    drugName: "Lisinopril",
    dosage: "20 mg",
    frequency: "1 tablet daily in the morning",
    route: "Oral",
    status: "ACTIVE",
    provenance: {
      type: "AI_EXTRACTED",
      documentId: "doc-rx-2026",
      documentName: "StJude_Clinic_Discharge_Prescription_July2026.pdf",
      pageNumber: 1,
      sourceSnippet: "Rx 3: Lisinopril 20mg tablet\n      Sig: Take 1 tablet daily in the morning.",
      timestamp: "2026-07-04T14:30:00Z",
      confidence: 0.98,
    },
    verificationStatus: "CONFIRMED",
    prescribedDate: "2026-07-04",
  },
];

export const DEMO_CONFLICTS: ClinicalConflict[] = [
  {
    id: "cnf-1",
    patientId: "pat-eleanor-vance-demo",
    conflictType: "ALLERGY_MEDICATION",
    severity: "CRITICAL",
    title: "Critical Allergy Conflict: Amoxicillin Prescribed to Patient with Recorded Penicillin Allergy",
    description: "Amoxicillin belongs to the penicillin class. Patient has recorded severe penicillin anaphylaxis.",
    valueA: "Documented Penicillin Allergy (Severe Anaphylaxis)",
    sourceA: "Patient Intake Record (USER_PROVIDED)",
    valueB: "Amoxicillin 500mg TID Prescribed",
    sourceB: "St. Jude Clinic Discharge Prescription p.1 (AI_EXTRACTED)",
    resolutionLabel: "Requires human verification",
    suggestedDoctorQuestion: "I was prescribed Amoxicillin, but I have a recorded allergy to penicillin. Can a non-penicillin antibiotic be prescribed instead?",
    status: "UNRESOLVED",
  },
  {
    id: "cnf-2",
    patientId: "pat-eleanor-vance-demo",
    conflictType: "LAB_DISCREPANCY",
    severity: "WARNING",
    title: "Medication Caution: Metformin 1000mg BID with Reduced eGFR (38 mL/min)",
    description: "Metformin requires caution and possible dose reduction when kidney filtration (eGFR) is below 45 mL/min.",
    valueA: "eGFR: 38 mL/min (Reduced Filtration)",
    sourceA: "Metro General CMP Report p.1 (AI_EXTRACTED)",
    valueB: "Metformin 1000mg BID (Maximum Standard Dosage)",
    sourceB: "St. Jude Discharge Orders p.1 (AI_EXTRACTED)",
    resolutionLabel: "Requires human verification",
    suggestedDoctorQuestion: "My recent kidney lab showed an eGFR of 38. Should my Metformin dose be reduced or re-evaluated?",
    status: "UNRESOLVED",
  },
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: "tl-1",
    patientId: "pat-eleanor-vance-demo",
    date: "Jan 12, 2026",
    eventType: "REPORT_FILED",
    title: "Baseline Routine Labs",
    description: "Annual physical labs: HbA1c 6.9%, Creatinine 1.05 mg/dL.",
    sourceDocumentName: "Metro General Annual Lab Sheet",
    badgeColor: "emerald",
  },
  {
    id: "tl-2",
    patientId: "pat-eleanor-vance-demo",
    date: "Jun 12, 2026",
    eventType: "LAB_FLAGGED",
    title: "Marked Glycemic & Renal Excursion",
    description: "HbA1c rose to 8.9% (+2.0% spike). Serum Creatinine increased to 1.85 mg/dL. eGFR decreased to 38 mL/min.",
    sourceDocumentName: "MetroGen_Comprehensive_Metabolic_Panel_June2026.pdf",
    highlightValue: "HbA1c 8.9% [HIGH]",
    badgeColor: "rose",
  },
  {
    id: "tl-3",
    patientId: "pat-eleanor-vance-demo",
    date: "Jun 12, 2026",
    eventType: "LAB_FLAGGED",
    title: "CBC Indicates Mild Microcytic Anemia",
    description: "Hemoglobin 10.2 g/dL with low MCV (78.5 fL).",
    sourceDocumentName: "MetroGen_Complete_Blood_Count_June2026.pdf",
    highlightValue: "Hgb 10.2 g/dL [LOW]",
    badgeColor: "amber",
  },
  {
    id: "tl-4",
    patientId: "pat-eleanor-vance-demo",
    date: "Jul 04, 2026",
    eventType: "MEDICATION_ORDERED",
    title: "Urgent Care Dental Discharge",
    description: "New prescription for Amoxicillin 500mg TID issued for dental abscess prophylaxis. Triggers critical allergy check.",
    sourceDocumentName: "StJude_Clinic_Discharge_Prescription_July2026.pdf",
    badgeColor: "rose",
  },
];

export const DEMO_SUMMARY: AISummary = {
  patientId: "pat-eleanor-vance-demo",
  isDemo: true,
  overview: "Eleanor's recent records from June and July 2026 highlight three key health parameters: blood sugar management, kidney filtration changes, and an important medication safety review. Her three-month average blood sugar (HbA1c) was recorded at 8.9%, which is higher than typical target limits. Her kidney lab tests show a reduced filtration rate (eGFR 38 mL/min). In addition, a recent urgent care order contains Amoxicillin, which requires immediate verification due to her recorded penicillin allergy.",
  plainLanguageLabs: [
    {
      testName: "Hemoglobin A1c (8.9%)",
      whatItMeans: "Reflects the average sugar bound to red blood cells over the preceding 2 to 3 months.",
      patientStatus: "Elevated compared to source report reference target (4.0 - 5.6%).",
    },
    {
      testName: "Serum Creatinine (1.85 mg/dL) & eGFR (38)",
      whatItMeans: "Measures how effectively the kidneys filter waste products from the bloodstream.",
      patientStatus: "Filtering capacity is lower than standard expectations (>60 mL/min).",
    },
    {
      testName: "Hemoglobin (10.2 g/dL)",
      whatItMeans: "The protein in red blood cells that transports oxygen throughout the body.",
      patientStatus: "Below typical adult reference range (12.0 - 16.0 g/dL), indicating mild anemia.",
    },
  ],
  questionsForDoctor: [
    {
      id: "q-1",
      question: "I was prescribed Amoxicillin, but my chart records a severe allergy to penicillin. What alternative antibiotic should I take?",
      reason: "Amoxicillin belongs to the penicillin drug family.",
      priority: "HIGH",
    },
    {
      id: "q-2",
      question: "My kidney filtration rate (eGFR) dropped to 38. Should my Metformin dose be adjusted?",
      reason: "Clinical guidelines often recommend adjusting Metformin when filtration falls below 45.",
      priority: "HIGH",
    },
    {
      id: "q-3",
      question: "My HbA1c rose to 8.9%. What dietary steps or medication reviews do you advise?",
      reason: "Significant change compared to January baseline.",
      priority: "MEDIUM",
    },
  ],
  generatedAt: "2026-07-04T15:00:00Z",
};
