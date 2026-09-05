import { NextResponse } from "next/server";
import { medlensStore } from "@/lib/db/medlens-store";
import { PatientProfile } from "@/types/clinical";

export async function GET() {
  try {
    const patients = medlensStore.listPatients();
    return NextResponse.json({ patients });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to list patients", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, dob, gender, bloodGroup, knownAllergies, chronicConditions } = body;

    if (!fullName || !dob) {
      return NextResponse.json(
        { error: "Full name and date of birth are required." },
        { status: 400 }
      );
    }

    const birthYear = new Date(dob).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    const mrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPatient: PatientProfile = {
      id: `patient-${Date.now()}`,
      mrn,
      fullName: fullName.trim(),
      dob,
      age: isNaN(age) ? 0 : age,
      gender: gender || "Other",
      bloodGroup: bloodGroup || "Unknown",
      knownAllergies: Array.isArray(knownAllergies)
        ? knownAllergies
        : knownAllergies ? [knownAllergies] : [],
      chronicConditions: Array.isArray(chronicConditions)
        ? chronicConditions
        : chronicConditions ? [chronicConditions] : [],
      isDemoPatient: false, // Explicitly marked as real user intake
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const record = medlensStore.createPatient(newPatient);
    return NextResponse.json({ patient: record.patient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create patient profile", details: error.message },
      { status: 500 }
    );
  }
}
