import { LabCategory, LabInterpretation } from "@/types/clinical";

export interface CanonicalRange {
  testName: string;
  aliases: string[];
  category: LabCategory;
  standardUnit: string;
  low: number;
  high: number;
  criticalLow?: number;
  criticalHigh?: number;
  description: string;
}

export const CANONICAL_REFERENCE_RANGES: Record<string, CanonicalRange> = {
  // Hematology (CBC)
  hemoglobin: {
    testName: "Hemoglobin",
    aliases: ["hgb", "hb", "haemoglobin"],
    category: "HEMATOLOGY",
    standardUnit: "g/dL",
    low: 12.0,
    high: 16.0,
    criticalLow: 7.0,
    criticalHigh: 20.0,
    description: "Protein in red blood cells that carries oxygen throughout the body.",
  },
  hematocrit: {
    testName: "Hematocrit",
    aliases: ["hct", "pcv"],
    category: "HEMATOLOGY",
    standardUnit: "%",
    low: 36.0,
    high: 48.0,
    criticalLow: 21.0,
    criticalHigh: 54.0,
    description: "Percentage of total blood volume made up of red blood cells.",
  },
  wbc: {
    testName: "White Blood Cells",
    aliases: ["wbc count", "leukocytes", "white count"],
    category: "HEMATOLOGY",
    standardUnit: "x10^3/uL",
    low: 4.5,
    high: 11.0,
    criticalLow: 2.0,
    criticalHigh: 30.0,
    description: "Immune system cells that defend against infections and disease.",
  },
  platelets: {
    testName: "Platelets",
    aliases: ["platelet count", "plt", "thrombocytes"],
    category: "HEMATOLOGY",
    standardUnit: "x10^3/uL",
    low: 150,
    high: 450,
    criticalLow: 50,
    criticalHigh: 1000,
    description: "Cell fragments essential for blood clotting and wound healing.",
  },
  rbc: {
    testName: "Red Blood Cells",
    aliases: ["rbc count", "erythrocytes"],
    category: "HEMATOLOGY",
    standardUnit: "x10^6/uL",
    low: 4.0,
    high: 5.4,
    description: "Cells responsible for transporting oxygen from lungs to body tissues.",
  },

  // Biochemistry / CMP / Renal / Metabolic
  creatinine: {
    testName: "Creatinine",
    aliases: ["serum creatinine", "creat", "cr"],
    category: "BIOCHEMISTRY",
    standardUnit: "mg/dL",
    low: 0.6,
    high: 1.2,
    criticalHigh: 3.5,
    description: "Waste product filtered by kidneys; elevated levels suggest reduced kidney filtration.",
  },
  bun: {
    testName: "Blood Urea Nitrogen (BUN)",
    aliases: ["bun", "urea nitrogen"],
    category: "BIOCHEMISTRY",
    standardUnit: "mg/dL",
    low: 7,
    high: 20,
    criticalHigh: 100,
    description: "Measure of nitrogen in blood from urea; evaluated alongside creatinine for kidney health.",
  },
  egfr: {
    testName: "eGFR",
    aliases: ["estimated gfr", "gfr"],
    category: "BIOCHEMISTRY",
    standardUnit: "mL/min/1.73m2",
    low: 60,
    high: 120,
    criticalLow: 15,
    description: "Estimated Glomerular Filtration Rate; primary index of overall kidney functioning.",
  },
  sodium: {
    testName: "Sodium",
    aliases: ["na", "serum sodium"],
    category: "BIOCHEMISTRY",
    standardUnit: "mmol/L",
    low: 135,
    high: 145,
    criticalLow: 120,
    criticalHigh: 160,
    description: "Key electrolyte regulating water balance, blood pressure, and neuromuscular signaling.",
  },
  potassium: {
    testName: "Potassium",
    aliases: ["k", "serum potassium"],
    category: "BIOCHEMISTRY",
    standardUnit: "mmol/L",
    low: 3.5,
    high: 5.1,
    criticalLow: 2.8,
    criticalHigh: 6.2,
    description: "Crucial electrolyte for cardiac rhythm and muscle contractions.",
  },
  calcium: {
    testName: "Calcium",
    aliases: ["ca", "total calcium"],
    category: "BIOCHEMISTRY",
    standardUnit: "mg/dL",
    low: 8.5,
    high: 10.2,
    criticalLow: 6.5,
    criticalHigh: 13.0,
    description: "Mineral essential for bone structure, nerve transmission, and muscle function.",
  },

  // Diabetes & Glucose
  glucose: {
    testName: "Fasting Glucose",
    aliases: ["fasting blood sugar", "fbs", "blood glucose", "serum glucose"],
    category: "DIABETES",
    standardUnit: "mg/dL",
    low: 70,
    high: 99,
    criticalLow: 50,
    criticalHigh: 400,
    description: "Primary circulating blood sugar; main energy source for body cells.",
  },
  hba1c: {
    testName: "Hemoglobin A1c (HbA1c)",
    aliases: ["glycated hemoglobin", "a1c", "glycohemoglobin"],
    category: "DIABETES",
    standardUnit: "%",
    low: 4.0,
    high: 5.6, // <5.7 normal, 5.7-6.4 prediabetes, >=6.5 diabetes
    criticalHigh: 10.0,
    description: "Reflects average blood sugar levels over the preceding 2 to 3 months.",
  },

  // Lipid Panel
  total_cholesterol: {
    testName: "Total Cholesterol",
    aliases: ["cholesterol", "cholesterol total"],
    category: "LIPID",
    standardUnit: "mg/dL",
    low: 125,
    high: 200,
    description: "Cumulative measure of circulating blood sterols.",
  },
  ldl: {
    testName: "LDL Cholesterol",
    aliases: ["ldl-c", "low density lipoprotein"],
    category: "LIPID",
    standardUnit: "mg/dL",
    low: 50,
    high: 100,
    description: "Often referred to as 'bad cholesterol'; builds plaque in arterial walls.",
  },
  hdl: {
    testName: "HDL Cholesterol",
    aliases: ["hdl-c", "high density lipoprotein"],
    category: "LIPID",
    standardUnit: "mg/dL",
    low: 40,
    high: 90,
    description: "Known as 'good cholesterol'; carries excess cholesterol back to liver.",
  },
  triglycerides: {
    testName: "Triglycerides",
    aliases: ["tg", "trigs"],
    category: "LIPID",
    standardUnit: "mg/dL",
    low: 50,
    high: 150,
    criticalHigh: 500,
    description: "Most common type of fat in body; stores unused energy from food.",
  },

  // Liver Function
  alt: {
    testName: "ALT (Alanine Aminotransferase)",
    aliases: ["sgpt", "alanine transaminase"],
    category: "BIOCHEMISTRY",
    standardUnit: "U/L",
    low: 7,
    high: 55,
    description: "Enzyme found primarily in liver cells; elevated with liver cell irritation.",
  },
  ast: {
    testName: "AST (Aspartate Aminotransferase)",
    aliases: ["sgot", "aspartate transaminase"],
    category: "BIOCHEMISTRY",
    standardUnit: "U/L",
    low: 8,
    high: 48,
    description: "Enzyme present in liver, heart, and muscle tissue.",
  },

  // Thyroid
  tsh: {
    testName: "TSH (Thyroid Stimulating Hormone)",
    aliases: ["thyrotropin", "serum tsh"],
    category: "THYROID",
    standardUnit: "uIU/mL",
    low: 0.4,
    high: 4.0,
    description: "Pituitary hormone that directs the thyroid gland to produce thyroid hormones.",
  },
};

/**
 * Normalizes test name to match canonical dictionary
 */
export function findCanonicalTest(testName: string): CanonicalRange | null {
  const clean = testName.trim().toLowerCase();
  
  for (const [key, range] of Object.entries(CANONICAL_REFERENCE_RANGES)) {
    if (key === clean || range.testName.toLowerCase() === clean) {
      return range;
    }
    for (const alias of range.aliases) {
      if (alias.toLowerCase() === clean || clean.includes(alias.toLowerCase())) {
        return range;
      }
    }
  }
  return null;
}

/**
 * Parses numeric value from a string (e.g. "9.8 g/dL" -> 9.8, "< 0.05" -> 0.05)
 */
export function parseNumericValue(val: string): number | null {
  if (!val) return null;
  const match = val.replace(/,/g, "").match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}

/**
 * Parses range string (e.g. "12.0 - 16.0", "< 100", "3.5 to 5.0")
 */
export function parseRangeString(rangeStr: string): { low: number | null; high: number | null } {
  if (!rangeStr) return { low: null, high: null };

  // "12.0 - 16.0" or "12.0 - 16.0 g/dL"
  const dashMatch = rangeStr.match(/([0-9.]+)\s*[-–—to]+\s*([0-9.]+)/i);
  if (dashMatch) {
    return { low: parseFloat(dashMatch[1]), high: parseFloat(dashMatch[2]) };
  }

  // "< 100"
  const lessMatch = rangeStr.match(/<\s*([0-9.]+)/);
  if (lessMatch) {
    return { low: 0, high: parseFloat(lessMatch[1]) };
  }

  // "> 60"
  const greaterMatch = rangeStr.match(/>\s*([0-9.]+)/);
  if (greaterMatch) {
    return { low: parseFloat(greaterMatch[1]), high: 9999 };
  }

  return { low: null, high: null };
}

/**
 * Evaluates a lab result deterministically against report range or canonical standard.
 * ZERO LLM hallucination for critical medical range categorization.
 */
export function evaluateLabResult(
  testName: string,
  rawValue: string,
  reportedRange?: string | null
): {
  interpretation: LabInterpretation;
  isCritical: boolean;
  numericValue: number | null;
  refRangeLow: number | null;
  refRangeHigh: number | null;
  canonicalRangeText: string;
  category: LabCategory;
  explanation: string;
} {
  const numeric = parseNumericValue(rawValue);
  const canonical = findCanonicalTest(testName);
  const parsedReportRange = reportedRange ? parseRangeString(reportedRange) : { low: null, high: null };

  const low = parsedReportRange.low ?? canonical?.low ?? null;
  const high = parsedReportRange.high ?? canonical?.high ?? null;
  const category: LabCategory = canonical?.category ?? "BIOCHEMISTRY";

  const canonicalRangeText = low !== null && high !== null
    ? `${low} - ${high} ${canonical?.standardUnit || ""}`.trim()
    : reportedRange || "Standard clinical review required";

  if (numeric === null || low === null || high === null) {
    return {
      interpretation: "INDETERMINATE",
      isCritical: false,
      numericValue: numeric,
      refRangeLow: low,
      refRangeHigh: high,
      canonicalRangeText,
      category,
      explanation: canonical?.description || "Observed clinical parameter.",
    };
  }

  // Check critical thresholds
  if (canonical?.criticalLow !== undefined && numeric <= canonical.criticalLow) {
    return {
      interpretation: "CRITICAL",
      isCritical: true,
      numericValue: numeric,
      refRangeLow: low,
      refRangeHigh: high,
      canonicalRangeText,
      category,
      explanation: `Critical low level. Canonical critical threshold is <= ${canonical.criticalLow}. Immediate physician notification advised.`,
    };
  }

  if (canonical?.criticalHigh !== undefined && numeric >= canonical.criticalHigh) {
    return {
      interpretation: "CRITICAL",
      isCritical: true,
      numericValue: numeric,
      refRangeLow: low,
      refRangeHigh: high,
      canonicalRangeText,
      category,
      explanation: `Critical high level. Canonical critical threshold is >= ${canonical.criticalHigh}. Immediate physician review advised.`,
    };
  }

  if (numeric < low) {
    return {
      interpretation: "LOW",
      isCritical: false,
      numericValue: numeric,
      refRangeLow: low,
      refRangeHigh: high,
      canonicalRangeText,
      category,
      explanation: `Value is below typical lower limit of ${low}. ${canonical?.description || ""}`,
    };
  }

  if (numeric > high) {
    return {
      interpretation: "HIGH",
      isCritical: false,
      numericValue: numeric,
      refRangeLow: low,
      refRangeHigh: high,
      canonicalRangeText,
      category,
      explanation: `Value is above typical upper limit of ${high}. ${canonical?.description || ""}`,
    };
  }

  return {
    interpretation: "NORMAL",
    isCritical: false,
    numericValue: numeric,
    refRangeLow: low,
    refRangeHigh: high,
    canonicalRangeText,
    category,
    explanation: `Within normal reference expectations (${low} - ${high}).`,
  };
}
