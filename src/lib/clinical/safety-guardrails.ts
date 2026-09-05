export const MANDATORY_SAFETY_DISCLAIMER =
  "NOTICE: MedLens is an assistive clinical information structuring and traceability tool. It does NOT provide medical diagnoses, prescribe medications, or alter dosages. All extracted records, flagged reference ranges, and synthesized explanations are intended solely for human clinical review and doctor-patient dialogue. Consult a qualified physician for any medical decisions.";

export const DEMO_MODE_WARNING =
  "DEMO MODE ACTIVE: You are viewing a synthetic, fictional clinical dataset. No live AI extraction has been performed on real patient data. Results are predefined for demonstration purposes only.";

const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /\byou have\s+(a\s+)?(heart attack|diabetes|kidney failure|cancer|stroke|infection)/i,
  /\bdiagnosed with\b/i,
  /\bthe patient is suffering from\b/i,
  /\bpatient has been diagnosed\b/i,
];

const FORBIDDEN_PRESCRIPTIVE_PATTERNS = [
  /\byou should (take|stop|increase|decrease|discontinue)\b/i,
  /\bwe prescribe\b/i,
  /\bprescribe\s+[0-9]+\s*(mg|ml|mcg)\b/i,
  /\bchange your (dose|dosage)\b/i,
  /\btake\s+[0-9]+\s*(tablets|pills|capsules)\b/i,
];

/**
 * Validates generated AI text against strict non-diagnostic and non-prescriptive safety boundaries.
 * If a violation is detected, sanitizes or wraps the text with appropriate clinical caveats.
 */
export function sanitizeClinicalAIText(text: string): {
  sanitizedText: string;
  hasViolations: boolean;
  violationDetails: string[];
} {
  let sanitized = text;
  const violationDetails: string[] = [];

  for (const pattern of FORBIDDEN_DIAGNOSTIC_PATTERNS) {
    if (pattern.test(sanitized)) {
      violationDetails.push(`Diagnostic statement detected: "${pattern.source}"`);
      sanitized = sanitized.replace(pattern, "Clinical data shows parameters associated with");
    }
  }

  for (const pattern of FORBIDDEN_PRESCRIPTIVE_PATTERNS) {
    if (pattern.test(sanitized)) {
      violationDetails.push(`Prescriptive statement detected: "${pattern.source}"`);
      sanitized = sanitized.replace(
        pattern,
        "A physician should evaluate whether to adjust"
      );
    }
  }

  return {
    sanitizedText: sanitized,
    hasViolations: violationDetails.length > 0,
    violationDetails,
  };
}

export type ProvenanceCategory =
  | "USER_PROVIDED"
  | "DOCUMENT_EXTRACTED_LIVE"
  | "DOCUMENT_EXTRACTED_DEMO"
  | "AI_GENERATED_SYNTHESIS"
  | "HUMAN_VERIFIED";

export function getProvenanceBadge(category: ProvenanceCategory): {
  label: string;
  badgeClass: string;
  tooltip: string;
} {
  switch (category) {
    case "USER_PROVIDED":
      return {
        label: "User Provided",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
        tooltip: "Supplied directly by the patient or user during registration.",
      };
    case "DOCUMENT_EXTRACTED_LIVE":
      return {
        label: "AI Extracted (Gemini)",
        badgeClass: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
        tooltip: "Extracted directly from uploaded document via Gemini 2.0 Flash with source provenance.",
      };
    case "DOCUMENT_EXTRACTED_DEMO":
      return {
        label: "Demo Dataset (Synthetic)",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
        tooltip: "Predefined fictional demo data. Not extracted live by AI.",
      };
    case "AI_GENERATED_SYNTHESIS":
      return {
        label: "AI Synthesis",
        badgeClass: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
        tooltip: "Plain-language summary synthesized from verified parameters. Not a medical opinion.",
      };
    case "HUMAN_VERIFIED":
      return {
        label: "Human Verified",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
        tooltip: "Reviewed and confirmed by a human user or clinician.",
      };
  }
}
