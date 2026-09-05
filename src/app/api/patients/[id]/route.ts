import { NextResponse } from "next/server";
import { medlensStore } from "@/lib/db/medlens-store";
import { isGeminiConfigured } from "@/lib/ai/gemini";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const record = medlensStore.getPatientRecord(patientId);

    if (!record) {
      return NextResponse.json(
        { error: `Patient record not found for ID: ${patientId}` },
        { status: 404 }
      );
    }

    const auditLogs = medlensStore.getAuditLogs(patientId);
    const geminiAvailable = isGeminiConfigured();

    return NextResponse.json({
      record,
      auditLogs,
      geminiAvailable,
      activeMode: geminiAvailable ? "LIVE" : "DEMO",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve patient record", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (body.action === "RESET_DEMO") {
      medlensStore.resetToDemo();
      return NextResponse.json({ success: true, message: "Demo data reset successfully." });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
