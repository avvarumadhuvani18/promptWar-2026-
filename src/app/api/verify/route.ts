import { NextResponse } from "next/server";
import { medlensStore } from "@/lib/db/medlens-store";
import { evaluateLabResult } from "@/lib/clinical/reference-ranges";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { patientId, entityType, entityId, updates, performedBy, reason } = body;

    if (!patientId || !entityType || !entityId) {
      return NextResponse.json(
        { error: "patientId, entityType, and entityId are required." },
        { status: 400 }
      );
    }

    const actor = performedBy || "Verified by Clinician";

    if (entityType === "OBSERVATION") {
      let finalUpdates = { ...updates };

      // If the user modified the lab value, recalculate reference range interpretation deterministically!
      if (updates.value) {
        const patientRecord = medlensStore.getPatientRecord(patientId);
        const existingObs = patientRecord?.observations.find((o) => o.id === entityId);
        if (existingObs) {
          const reEval = evaluateLabResult(
            existingObs.testName,
            updates.value,
            existingObs.refRangeText
          );
          finalUpdates = {
            ...finalUpdates,
            numericValue: reEval.numericValue,
            interpretation: reEval.interpretation,
            isCritical: reEval.isCritical,
            canonicalRange: reEval.canonicalRangeText,
            verificationStatus: "EDITED",
            notes: reEval.explanation,
          };
        }
      }

      const updated = medlensStore.updateObservation(
        patientId,
        entityId,
        finalUpdates,
        actor,
        reason
      );

      if (!updated) {
        return NextResponse.json({ error: "Observation not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, updatedObservation: updated });
    }

    if (entityType === "MEDICATION") {
      const updated = medlensStore.updateMedication(
        patientId,
        entityId,
        updates,
        actor
      );

      if (!updated) {
        return NextResponse.json({ error: "Medication not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, updatedMedication: updated });
    }

    return NextResponse.json({ error: "Unsupported entityType" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Verification update failed", details: error.message },
      { status: 500 }
    );
  }
}
