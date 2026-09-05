import fs from "fs";
import path from "path";
import {
  FullPatientRecord,
  PatientProfile,
  MedicalDocument,
  LabObservation,
  Medication,
  MedicalCondition,
  ClinicalConflict,
  PatientSummaryData,
} from "@/types/clinical";
import { AuditEntry } from "@/types/provenance";
import { DEMO_PATIENT } from "./seed-data";

interface StoreSchema {
  patients: Record<string, FullPatientRecord>;
  auditLogs: AuditEntry[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "medlens_db.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore(): StoreSchema {
  ensureDirectoryExists();
  if (!fs.existsSync(DB_FILE)) {
    const initialStore: StoreSchema = {
      patients: {
        [DEMO_PATIENT.patient.id]: JSON.parse(JSON.stringify(DEMO_PATIENT)),
      },
      auditLogs: [
        {
          id: "audit-init-1",
          entityId: "obs-glucose-1",
          entityType: "OBSERVATION",
          action: "AUTO_EXTRACTED",
          performedBy: "Predefined Fictional Demo Dataset",
          timestamp: "2026-06-12T10:15:00.000Z",
          reason: "Initial synthetic record baseline",
        },
        {
          id: "audit-init-2",
          entityId: "obs-glucose-1",
          entityType: "OBSERVATION",
          action: "USER_VERIFIED",
          performedBy: "Dr. Sarah Jenkins (PCP)",
          timestamp: "2026-06-12T11:00:00.000Z",
          reason: "Routine clinical confirmation",
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), "utf-8");
    return initialStore;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse medlens_db.json, resetting with demo data:", err);
    const fallbackStore: StoreSchema = {
      patients: {
        [DEMO_PATIENT.patient.id]: JSON.parse(JSON.stringify(DEMO_PATIENT)),
      },
      auditLogs: [],
    };
    return fallbackStore;
  }
}

function saveStore(store: StoreSchema) {
  ensureDirectoryExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export const medlensStore = {
  getPatientRecord(patientId: string): FullPatientRecord | null {
    const store = loadStore();
    return store.patients[patientId] || null;
  },

  listPatients(): PatientProfile[] {
    const store = loadStore();
    return Object.values(store.patients).map((p) => p.patient);
  },

  createPatient(patient: PatientProfile): FullPatientRecord {
    const store = loadStore();
    const newRecord: FullPatientRecord = {
      isDemoMode: patient.isDemoPatient,
      patient,
      documents: [],
      observations: [],
      medications: [],
      conditions: [],
      conflicts: [],
    };
    store.patients[patient.id] = newRecord;
    saveStore(store);
    return newRecord;
  },

  addDocument(doc: MedicalDocument): void {
    const store = loadStore();
    const record = store.patients[doc.patientId];
    if (record) {
      record.documents.unshift(doc);
      saveStore(store);
    }
  },

  getDocument(patientId: string, docId: string): MedicalDocument | null {
    const store = loadStore();
    const record = store.patients[patientId];
    return record?.documents.find((d) => d.id === docId) || null;
  },

  addExtractedData(
    patientId: string,
    observations: LabObservation[],
    medications: Medication[],
    conditions: MedicalCondition[],
    conflicts: ClinicalConflict[],
    auditActor: string
  ): void {
    const store = loadStore();
    const record = store.patients[patientId];
    if (!record) return;

    record.observations.push(...observations);
    record.medications.push(...medications);
    record.conditions.push(...conditions);
    record.conflicts.push(...conflicts);

    for (const obs of observations) {
      store.auditLogs.push({
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        entityId: obs.id,
        entityType: "OBSERVATION",
        action: "AUTO_EXTRACTED",
        performedBy: auditActor,
        timestamp: new Date().toISOString(),
      });
    }

    saveStore(store);
  },

  updateObservation(
    patientId: string,
    obsId: string,
    updates: Partial<LabObservation>,
    performedBy: string,
    reason?: string
  ): LabObservation | null {
    const store = loadStore();
    const record = store.patients[patientId];
    if (!record) return null;

    const obsIndex = record.observations.findIndex((o) => o.id === obsId);
    if (obsIndex === -1) return null;

    const oldObs = record.observations[obsIndex];
    const newObs = { ...oldObs, ...updates, updatedAt: new Date().toISOString() };
    record.observations[obsIndex] = newObs;

    store.auditLogs.push({
      id: `audit-${Date.now()}`,
      entityId: obsId,
      entityType: "OBSERVATION",
      action: updates.verificationStatus === "VERIFIED" ? "USER_VERIFIED" : "USER_EDITED",
      fieldName: updates.value ? "value" : "verificationStatus",
      oldValue: oldObs.value,
      newValue: updates.value || updates.verificationStatus,
      performedBy,
      timestamp: new Date().toISOString(),
      reason,
    });

    saveStore(store);
    return newObs;
  },

  updateMedication(
    patientId: string,
    medId: string,
    updates: Partial<Medication>,
    performedBy: string
  ): Medication | null {
    const store = loadStore();
    const record = store.patients[patientId];
    if (!record) return null;

    const medIndex = record.medications.findIndex((m) => m.id === medId);
    if (medIndex === -1) return null;

    const oldMed = record.medications[medIndex];
    const newMed = { ...oldMed, ...updates };
    record.medications[medIndex] = newMed;

    store.auditLogs.push({
      id: `audit-${Date.now()}`,
      entityId: medId,
      entityType: "MEDICATION",
      action: updates.verificationStatus === "VERIFIED" ? "USER_VERIFIED" : "USER_EDITED",
      performedBy,
      timestamp: new Date().toISOString(),
    });

    saveStore(store);
    return newMed;
  },

  saveSummary(patientId: string, summary: PatientSummaryData): void {
    const store = loadStore();
    const record = store.patients[patientId];
    if (record) {
      record.latestSummary = summary;
      saveStore(store);
    }
  },

  getAuditLogs(patientId?: string): AuditEntry[] {
    const store = loadStore();
    return store.auditLogs.slice().reverse();
  },

  resetToDemo(): void {
    const freshStore: StoreSchema = {
      patients: {
        [DEMO_PATIENT.patient.id]: JSON.parse(JSON.stringify(DEMO_PATIENT)),
      },
      auditLogs: [],
    };
    saveStore(freshStore);
  },
};
