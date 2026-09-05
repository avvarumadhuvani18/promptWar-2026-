import { NextResponse } from "next/server";
import { medlensStore } from "@/lib/db/medlens-store";
import { isGeminiConfigured, generateSummaryWithGemini } from "@/lib/ai/gemini";
import { DEMO_PATIENT } from "@/lib/db/seed-data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }

    const record = medlensStore.getPatientRecord(patientId);
    if (!record) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    // If Gemini is configured, generate live summary
    if (isGeminiConfigured()) {
      const summary = await generateSummaryWithGemini(record);
      medlensStore.saveSummary(patientId, summary);
      return NextResponse.json({
        success: true,
        engineUsed: "LIVE_GEMINI_AI",
        summary,
      });
    }

    // If Gemini is NOT configured:
    // Check if this is the predefined Demo Patient
    if (record.patient.isDemoPatient) {
      const demoSummary = DEMO_PATIENT.latestSummary!;
      medlensStore.saveSummary(patientId, demoSummary);
      return NextResponse.json({
        success: true,
        engineUsed: "PREDEFINED_DEMO_SYNTHESIS",
        demoModeActive: true,
        message: "Loaded predefined synthetic clinical summary for demonstration.",
        summary: demoSummary,
      });
    }

    // For non-demo real patient without Gemini key:
    return NextResponse.json(
      {
        success: false,
        error: "GEMINI_API_KEY_REQUIRED",
        demoModeActive: true,
        message:
          "AI summarization requires a valid GEMINI_API_KEY in .env.local. MedLens refuses to generate simulated or fake summaries on real patient profiles without an active AI engine.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Summary generation failed", details: error.message },
      { status: 500 }
    );
  }
}
