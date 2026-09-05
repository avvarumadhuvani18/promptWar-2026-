import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CLINICAL_EXTRACTION_SYSTEM_PROMPT,
  PATIENT_SUMMARY_SYSTEM_PROMPT,
} from "./prompts";
import { evaluateLabResult } from "../clinical/reference-ranges";
import {
  LabObservation,
  Medication,
  MedicalCondition,
  PatientSummaryData,
  FullPatientRecord,
} from "@/types/clinical";
import { sanitizeClinicalAIText, MANDATORY_SAFETY_DISCLAIMER } from "../clinical/safety-guardrails";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "MISSING_GEMINI_KEY: GEMINI_API_KEY is not configured in environment variables."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

export interface ExtractionResult {
  documentType: "LAB_REPORT" | "PRESCRIPTION" | "CLINICAL_NOTE" | "DISCHARGE_SUMMARY";
  facilityName: string;
  reportDate: string;
  patientNameMentioned?: string;
  observations: Array<{
    testName: string;
    value: string;
    unit: string;
    refRangeText: string | null;
    sourceSnippet: string;
    pageNumber: number;
    confidenceScore: number;
  }>;
  medications: Array<{
    drugName: string;
    dosage: string;
    frequency: string;
    route: string;
    purpose?: string;
    sourceSnippet: string;
    pageNumber: number;
    confidenceScore: number;
  }>;
  conditions: Array<{
    conditionName: string;
    status: "ACTIVE" | "RESOLVED" | "SUSPECTED";
    sourceSnippet: string;
    pageNumber: number;
    confidenceScore: number;
  }>;
}

/**
 * Extracts clinical data from a document buffer using live Gemini Multimodal AI.
 * If API is not configured, this will explicitly fail with a clear message rather than faking AI extraction.
 */
export async function extractDocumentWithGemini(
  fileBufferBase64: string,
  mimeType: string,
  documentName: string
): Promise<ExtractionResult> {
  if (!isGeminiConfigured()) {
    throw new Error(
      "AI_API_UNAVAILABLE: Gemini API key is not configured. Live document extraction requires a valid GEMINI_API_KEY. Use the predefined Fictional Demo Patient to explore MedLens capabilities without an API key."
    );
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1, // Near deterministic for clinical extraction
    },
  });

  const prompt = `${CLINICAL_EXTRACTION_SYSTEM_PROMPT}

Analyze the attached medical document (${documentName}) and extract all clinical observations, medications, and conditions with verbatim source snippets and page numbers.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: fileBufferBase64,
        mimeType: mimeType,
      },
    },
  ]);

  const rawJson = result.response.text();
  const parsed = JSON.parse(rawJson) as ExtractionResult;
  return parsed;
}

/**
 * Synthesizes a patient-friendly summary and doctor consultation guide using Gemini AI.
 */
export async function generateSummaryWithGemini(
  record: FullPatientRecord
): Promise<PatientSummaryData> {
  if (!isGeminiConfigured()) {
    throw new Error(
      "AI_API_UNAVAILABLE: Gemini API key is not configured. Summary generation requires GEMINI_API_KEY."
    );
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const contextData = {
    patient: {
      age: record.patient.age,
      gender: record.patient.gender,
      allergies: record.patient.knownAllergies,
      conditions: record.patient.chronicConditions,
    },
    observations: record.observations.map((o) => ({
      testName: o.testName,
      value: `${o.value} ${o.unit}`,
      interpretation: o.interpretation,
      referenceRange: o.canonicalRange || o.refRangeText,
      isCritical: o.isCritical,
    })),
    medications: record.medications.map((m) => ({
      drug: m.drugName,
      dose: m.dosage,
      freq: m.frequency,
      status: m.status,
    })),
    conflictsDetected: record.conflicts.map((c) => ({
      title: c.title,
      severity: c.severity,
      implication: c.clinicalImplication,
    })),
  };

  const prompt = `${PATIENT_SUMMARY_SYSTEM_PROMPT}

Patient Medical Context:
${JSON.stringify(contextData, null, 2)}
`;

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text());

  // Sanitize for safety compliance
  const sanitizedOverview = sanitizeClinicalAIText(parsed.overview || "");

  return {
    id: `sum-${Date.now()}`,
    patientId: record.patient.id,
    overview: sanitizedOverview.sanitizedText,
    engineUsed: "LIVE_GEMINI_AI",
    plainLanguageLabs: parsed.plainLanguageLabs || [],
    questionsForDoctor: (parsed.questionsForDoctor || []).map(
      (q: any, i: number) => ({
        id: `q-${i + 1}`,
        question: q.question,
        context: q.context,
        priority: q.priority || "STANDARD",
      })
    ),
    clinicianBriefing: parsed.clinicianBriefing || {
      chiefIssues: [],
      criticalValues: [],
      medicationRegimen: [],
      discrepancyAlerts: [],
    },
    safetyDisclaimer: MANDATORY_SAFETY_DISCLAIMER,
    generatedAt: new Date().toISOString(),
  };
}
