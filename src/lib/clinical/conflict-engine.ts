import {
  ClinicalConflict,
  LabObservation,
  Medication,
  PatientProfile,
} from "@/types/clinical";

interface DrugAllergyClass {
  allergyName: string;
  triggerDrugs: string[];
  severity: "CRITICAL" | "WARNING";
  rationale: string;
}

const ALLERGY_DRUG_CLASSES: DrugAllergyClass[] = [
  {
    allergyName: "penicillin",
    triggerDrugs: [
      "amoxicillin",
      "augmentin",
      "ampicillin",
      "penicillin",
      "piperacillin",
      "oxacillin",
      "amoxil",
      "unasyn",
      "zosyn",
    ],
    severity: "CRITICAL",
    rationale: "Amoxicillin and aminopenicillins share the beta-lactam core of Penicillin and present high risk of severe hypersensitivity/anaphylaxis.",
  },
  {
    allergyName: "sulfa",
    triggerDrugs: [
      "bactrim",
      "septra",
      "sulfamethoxazole",
      "sulfasalazine",
      "sulfadiazine",
    ],
    severity: "CRITICAL",
    rationale: "Sulfonamide antimicrobial cross-reactivity can trigger severe dermatological and systemic allergic reactions.",
  },
  {
    allergyName: "aspirin",
    triggerDrugs: [
      "aspirin",
      "ibuprofen",
      "advil",
      "motrin",
      "naproxen",
      "aleve",
      "ketorolac",
      "meloxicam",
    ],
    severity: "WARNING",
    rationale: "Cross-reactivity between Aspirin and other NSAIDs can induce bronchospasm, urticaria, or gastrointestinal ulceration.",
  },
  {
    allergyName: "codeine",
    triggerDrugs: ["codeine", "morphine", "hydrocodone", "oxycodone", "tylenol 3"],
    severity: "CRITICAL",
    rationale: "Opioid cross-reactivity and shared metabolic pathways can provoke histamine release and respiratory depression.",
  },
];

export function detectClinicalConflicts(
  patient: PatientProfile,
  medications: Medication[],
  currentLabs: LabObservation[],
  historicalLabs?: LabObservation[]
): ClinicalConflict[] {
  const conflicts: ClinicalConflict[] = [];

  // 1. ALLERGY - MEDICATION CONFLICTS
  for (const allergy of patient.knownAllergies) {
    const cleanAllergy = allergy.toLowerCase().trim();
    const matchedClass = ALLERGY_DRUG_CLASSES.find((ac) =>
      cleanAllergy.includes(ac.allergyName)
    );

    if (matchedClass) {
      for (const med of medications) {
        const cleanMedName = med.drugName.toLowerCase().trim();
        const isTrigger = matchedClass.triggerDrugs.some((td) =>
          cleanMedName.includes(td)
        );

        if (isTrigger) {
          conflicts.push({
            id: `conflict-allergy-${med.id}`,
            patientId: patient.id,
            type: "ALLERGY_MEDICATION_CONFLICT",
            severity: matchedClass.severity,
            title: `Severe Contraindication: ${med.drugName} Prescribed Despite Documented ${allergy} Allergy`,
            description: `Patient has documented allergy to "${allergy}", but received prescription for "${med.drugName} ${med.dosage || ""}".`,
            clinicalImplication: matchedClass.rationale,
            suggestedDoctorQuestion: `I noticed ${med.drugName} was prescribed, but I have a recorded allergy to ${allergy}. Is this safe to take, or is an alternative antibiotic required?`,
            involvedDocumentIds: [med.documentId],
            involvedItems: [allergy, med.drugName],
            resolutionStatus: "UNRESOLVED",
            detectedAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  // 2. LONGITUDINAL LAB TREND ANOMALIES
  if (historicalLabs && historicalLabs.length > 0) {
    for (const current of currentLabs) {
      if (current.numericValue === null) continue;

      // Find most recent prior observation of the same test
      const prior = historicalLabs
        .filter(
          (h) =>
            h.testName.toLowerCase() === current.testName.toLowerCase() &&
            h.numericValue !== null &&
            h.id !== current.id
        )
        .sort(
          (a, b) =>
            new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime()
        )[0];

      if (!prior || prior.numericValue === null) continue;

      const delta = current.numericValue - prior.numericValue;
      const cleanName = current.testName.toLowerCase();

      // HbA1c spike check
      if (cleanName.includes("hba1c") || cleanName.includes("a1c")) {
        if (delta >= 1.2) {
          conflicts.push({
            id: `conflict-trend-a1c-${current.id}`,
            patientId: patient.id,
            type: "LAB_TREND_ANOMALY",
            severity: "WARNING",
            title: `Significant HbA1c Elevation (+${delta.toFixed(1)}%)`,
            description: `HbA1c increased from ${prior.numericValue}% (Prior) to ${current.numericValue}% (Current).`,
            clinicalImplication: "Indicates progressive glycemic elevation over the past 3 months, warranting review of diabetes regimen.",
            suggestedDoctorQuestion: `My HbA1c rose from ${prior.numericValue}% to ${current.numericValue}%. Do we need to adjust my lifestyle plan or medications?`,
            involvedDocumentIds: [prior.documentId, current.documentId],
            involvedItems: ["HbA1c", `${prior.numericValue}% -> ${current.numericValue}%`],
            resolutionStatus: "UNRESOLVED",
            detectedAt: new Date().toISOString(),
          });
        }
      }

      // Creatinine jump check (kidney alert)
      if (cleanName.includes("creatinine")) {
        if (delta >= 0.4 || current.numericValue >= 1.6) {
          conflicts.push({
            id: `conflict-trend-creat-${current.id}`,
            patientId: patient.id,
            type: "LAB_TREND_ANOMALY",
            severity: "CRITICAL",
            title: `Acute Renal Function Trend: Serum Creatinine Jump (+${delta.toFixed(2)} mg/dL)`,
            description: `Serum creatinine elevated from baseline ${prior.numericValue} mg/dL to ${current.numericValue} mg/dL.`,
            clinicalImplication: "Acute elevation in creatinine indicates reduced glomerular filtration rate. Medications cleared renally (such as Metformin) should be evaluated for dose adjustment.",
            suggestedDoctorQuestion: `My kidney test (Creatinine) increased to ${current.numericValue} mg/dL. Does this affect any of my current daily medications?`,
            involvedDocumentIds: [prior.documentId, current.documentId],
            involvedItems: ["Creatinine", `${prior.numericValue} -> ${current.numericValue} mg/dL`],
            resolutionStatus: "UNRESOLVED",
            detectedAt: new Date().toISOString(),
          });
        }
      }

      // Hemoglobin drop (anemia / blood loss)
      if (cleanName.includes("hemoglobin") || cleanName.includes("hgb")) {
        if (delta <= -1.8) {
          conflicts.push({
            id: `conflict-trend-hgb-${current.id}`,
            patientId: patient.id,
            type: "LAB_TREND_ANOMALY",
            severity: "WARNING",
            title: `Rapid Hemoglobin Decline (${delta.toFixed(1)} g/dL)`,
            description: `Hemoglobin declined from ${prior.numericValue} g/dL to ${current.numericValue} g/dL.`,
            clinicalImplication: "Significant downward shift in red blood cell volume. May suggest worsening anemia, iron deficiency, or occult bleeding.",
            suggestedDoctorQuestion: `My hemoglobin dropped to ${current.numericValue} g/dL. Should we investigate causes for anemia or test my iron levels?`,
            involvedDocumentIds: [prior.documentId, current.documentId],
            involvedItems: ["Hemoglobin", `${prior.numericValue} -> ${current.numericValue} g/dL`],
            resolutionStatus: "UNRESOLVED",
            detectedAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  // 3. MEDICATION - CONDITION CONTRAINDICATION (e.g. Metformin in elevated Creatinine)
  const creatinineLab = currentLabs.find((l) =>
    l.testName.toLowerCase().includes("creatinine")
  );
  const metforminMed = medications.find((m) =>
    m.drugName.toLowerCase().includes("metformin")
  );

  if (
    creatinineLab &&
    creatinineLab.numericValue !== null &&
    creatinineLab.numericValue >= 1.6 &&
    metforminMed
  ) {
    conflicts.push({
      id: `conflict-metformin-renal-${metforminMed.id}`,
      patientId: patient.id,
      type: "DOSAGE_UNCERTAINTY",
      severity: "WARNING",
      title: `Medication Caution: Metformin in Elevated Creatinine (${creatinineLab.numericValue} mg/dL)`,
      description: `Patient is actively prescribed ${metforminMed.drugName} ${metforminMed.dosage || ""}, while serum creatinine is ${creatinineLab.numericValue} mg/dL.`,
      clinicalImplication: "FDA clinical guidelines recommend reassessing Metformin dosage or checking eGFR (<45 mL/min requires dose reduction; <30 mL/min is contraindicated) to avoid lactic acidosis risk.",
      suggestedDoctorQuestion: `Given my recent kidney lab result, is my current dose of Metformin still appropriate, or should the dose be adjusted?`,
      involvedDocumentIds: [metforminMed.documentId, creatinineLab.documentId],
      involvedItems: [metforminMed.drugName, "Creatinine: " + creatinineLab.numericValue],
      resolutionStatus: "UNRESOLVED",
      detectedAt: new Date().toISOString(),
    });
  }

  return conflicts;
}
