import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { medlensStore } from "@/lib/db/medlens-store";
import { isGeminiConfigured, extractDocumentWithGemini } from "@/lib/ai/gemini";
import { evaluateLabResult } from "@/lib/clinical/reference-ranges";
import { detectClinicalConflicts } from "@/lib/clinical/conflict-engine";
import {
  MedicalDocument,
  LabObservation,
  Medication,
  MedicalCondition,
} from "@/types/clinical";

const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const patientId = formData.get("patientId") as string | null;
    const documentType = (formData.get("documentType") as any) || "LAB_REPORT";

    if (!file || !patientId) {
      return NextResponse.json(
        { error: "File and patientId are required." },
        { status: 400 }
      );
    }

    const patientRecord = medlensStore.getPatientRecord(patientId);
    if (!patientRecord) {
      return NextResponse.json(
        { error: `Patient record not found: ${patientId}` },
        { status: 404 }
      );
    }

    // Save uploaded file to disk
    ensureUploadDir();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = path.join(UPLOAD_DIR, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const docId = `doc-${Date.now()}`;
    const newDoc: MedicalDocument = {
      id: docId,
      patientId,
      filename: file.name,
      fileType: file.type as any,
      fileUrl: `/api/documents/raw?name=${safeFilename}`,
      documentType,
      reportDate: new Date().toISOString().split("T")[0],
      facilityName: "Uploaded Clinical Facility",
      processingStatus: "PROCESSING",
      pageCount: 1,
      uploadedAt: new Date().toISOString(),
      isFictionalDemo: false,
    };

    medlensStore.addDocument(newDoc);

    // Check Gemini AI Availability
    if (!isGeminiConfigured()) {
      // STRICT SAFETY REQUIREMENT: Never pretend to be live AI extraction!
      newDoc.processingStatus = "FAILED";
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY_REQUIRED",
          demoModeActive: true,
          message:
            "Live AI extraction is unavailable because GEMINI_API_KEY is not configured in .env.local. MedLens will never fake or hallucinate extractions on user documents. To test live multimodal extraction, provide a Gemini API key. To view pre-extracted records, explore the Fictional Demo Patient (Eleanor Vance).",
          document: newDoc,
        },
        { status: 503 }
      );
    }

    // Execute Live Gemini Multimodal Extraction
    const base64Data = buffer.toString("base64");
    const extracted = await extractDocumentWithGemini(
      base64Data,
      file.type,
      file.name
    );

    // Deterministic Reference Range Evaluation on every extracted test
    const observations: LabObservation[] = (extracted.observations || []).map(
      (obs, idx) => {
        const evalResult = evaluateLabResult(
          obs.testName,
          obs.value,
          obs.refRangeText
        );

        return {
          id: `obs-${Date.now()}-${idx}`,
          patientId,
          documentId: docId,
          testName: obs.testName,
          category: evalResult.category,
          value: obs.value,
          numericValue: evalResult.numericValue,
          unit: obs.unit || "",
          refRangeLow: evalResult.refRangeLow,
          refRangeHigh: evalResult.refRangeHigh,
          refRangeText: obs.refRangeText || null,
          canonicalRange: evalResult.canonicalRangeText,
          interpretation: evalResult.interpretation,
          isCritical: evalResult.isCritical,
          provenance: {
            documentId: docId,
            documentName: file.name,
            pageNumber: obs.pageNumber || 1,
            sourceSnippet: obs.sourceSnippet || `${obs.testName} ${obs.value}`,
            confidenceScore: obs.confidenceScore || 0.9,
            extractionEngine: "LIVE_GEMINI_AI", // Explicitly documented as real AI
          },
          verificationStatus: "EXTRACTED",
          observedAt: new Date().toISOString(),
          notes: evalResult.explanation,
        };
      }
    );

    // Format Extracted Medications with Provenance
    const medications: Medication[] = (extracted.medications || []).map(
      (med, idx) => ({
        id: `med-${Date.now()}-${idx}`,
        patientId,
        documentId: docId,
        drugName: med.drugName,
        dosage: med.dosage || "",
        frequency: med.frequency || "",
        route: med.route || "Oral",
        purpose: med.purpose || "",
        status: "ACTIVE",
        provenance: {
          documentId: docId,
          documentName: file.name,
          pageNumber: med.pageNumber || 1,
          sourceSnippet: med.sourceSnippet || `${med.drugName} ${med.dosage}`,
          confidenceScore: med.confidenceScore || 0.9,
          extractionEngine: "LIVE_GEMINI_AI",
        },
        verificationStatus: "EXTRACTED",
        prescribedDate: new Date().toISOString().split("T")[0],
      })
    );

    // Format Conditions
    const conditions: MedicalCondition[] = (extracted.conditions || []).map(
      (cond, idx) => ({
        id: `cond-${Date.now()}-${idx}`,
        patientId,
        documentId: docId,
        conditionName: cond.conditionName,
        status: cond.status || "ACTIVE",
        provenance: {
          documentId: docId,
          documentName: file.name,
          pageNumber: cond.pageNumber || 1,
          sourceSnippet: cond.sourceSnippet || cond.conditionName,
          confidenceScore: cond.confidenceScore || 0.9,
          extractionEngine: "LIVE_GEMINI_AI",
        },
        verificationStatus: "EXTRACTED",
        firstNotedDate: new Date().toISOString().split("T")[0],
      })
    );

    // Run Conflict Detection against existing history
    const allPatientMeds = [...patientRecord.medications, ...medications];
    const conflicts = detectClinicalConflicts(
      patientRecord.patient,
      allPatientMeds,
      observations,
      patientRecord.observations
    );

    // Persist all extracted entities
    newDoc.processingStatus = "COMPLETED";
    newDoc.facilityName = extracted.facilityName || newDoc.facilityName;
    newDoc.documentType = extracted.documentType || newDoc.documentType;

    medlensStore.addExtractedData(
      patientId,
      observations,
      medications,
      conditions,
      conflicts,
      "Live AI (Gemini 2.0 Flash)"
    );

    return NextResponse.json({
      success: true,
      extractionEngine: "LIVE_GEMINI_AI",
      document: newDoc,
      observationsCount: observations.length,
      medicationsCount: medications.length,
      conflictsCount: conflicts.length,
    });
  } catch (error: any) {
    console.error("Document upload/extraction failed:", error);
    return NextResponse.json(
      { error: "Document processing failed", details: error.message },
      { status: 500 }
    );
  }
}
