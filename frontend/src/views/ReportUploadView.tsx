import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  FileScan,
  FileImage,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Info,
  FolderOpen,
} from "lucide-react";
import { ActiveScreen, MedicalDocument } from "@/types/clinical";

// Types
type UploadStatus = "READY" | "PROCESSING" | "UPLOADED" | "FAILED";

interface QueuedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  extension: string;
  status: UploadStatus;
  addedAt: string;
}

interface RejectedFile {
  name: string;
  reason: string;
}

// Constants
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];
const MAX_BYTES = 10 * 1024 * 1024;

const FILE_TYPE_LABEL: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

// Helpers
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function uniqueId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function validateFile(file: File): { ok: boolean; reason?: string } {
  const ext = fileExtension(file.name);
  if (!ACCEPTED_MIME.includes(file.type) && !ACCEPTED_EXT.includes(ext)) {
    return {
      ok: false,
      reason: `Unsupported format "${ext || file.type || "unknown"}". Only PDF, JPG, JPEG, PNG are accepted.`,
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      reason: `File exceeds 10 MB limit (${formatBytes(file.size)}).`,
    };
  }
  if (file.size === 0) {
    return { ok: false, reason: "File appears to be empty." };
  }
  return { ok: true };
}

function fileIcon(mimeType: string) {
  if (mimeType === "application/pdf") return <FileScan className="w-4 h-4" />;
  if (mimeType.startsWith("image/")) return <FileImage className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

function StatusBadge({ status }: { status: UploadStatus }) {
  const map: Record<UploadStatus, { label: string; className: string; icon: React.ReactNode }> = {
    READY: { label: "READY", className: "bg-slate-800 text-slate-300 border-slate-700", icon: <Clock className="w-3 h-3" /> },
    PROCESSING: { label: "PROCESSING", className: "bg-amber-950/60 text-amber-400 border-amber-800/60", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    UPLOADED: { label: "ACCEPTED", className: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60", icon: <CheckCircle2 className="w-3 h-3" /> },
    FAILED: { label: "FAILED", className: "bg-red-950/60 text-red-400 border-red-800/60", icon: <AlertCircle className="w-3 h-3" /> },
  };
  const { label, className, icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${className}`}>
      {icon}{label}
    </span>
  );
}

interface ReportUploadViewProps {
  documents: MedicalDocument[];
  onNavigate: (screen: ActiveScreen) => void;
  onStartProcessing: () => void;
  onAddDocuments?: (docs: MedicalDocument[]) => void;
}

export const ReportUploadView: React.FC<ReportUploadViewProps> = ({
  documents,
  onNavigate,
  onStartProcessing: _onStartProcessing,
  onAddDocuments,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>(() => {
    try {
      const stored = localStorage.getItem("medlens_uploaded_reports");
      if (stored) return JSON.parse(stored) as QueuedFile[];
    } catch { /* ignore */ }
    return [];
  });
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const ingestFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newQueue: QueuedFile[] = [];
    const newRejected: RejectedFile[] = [];
    for (const file of fileArray) {
      const result = validateFile(file);
      if (!result.ok) {
        newRejected.push({ name: file.name, reason: result.reason! });
      } else {
        newQueue.push({
          id: uniqueId(),
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          extension: fileExtension(file.name).slice(1).toUpperCase(),
          status: "READY",
          addedAt: new Date().toISOString(),
        });
      }
    }
    setRejected((prev) => [...prev, ...newRejected]);
    setQueue((prev) => {
      const next = [...prev, ...newQueue];
      try { localStorage.setItem("medlens_uploaded_reports", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    if (newQueue.length > 0) { setProcessSuccess(false); setProcessError(null); }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave" || e.type === "drop") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      ingestFiles(e.dataTransfer.files); e.dataTransfer.clearData();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { ingestFiles(e.target.files); e.target.value = ""; }
  };

  const removeFile = (id: string) => {
    setQueue((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try { localStorage.setItem("medlens_uploaded_reports", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const handleProcess = async () => {
    const readyFiles = queue.filter((f) => f.status === "READY");
    if (readyFiles.length === 0) {
      setProcessError("No files with READY status to process. Please add valid reports first.");
      return;
    }
    setProcessError(null); setIsProcessing(true);
    setQueue((prev) => prev.map((f) => (f.status === "READY" ? { ...f, status: "PROCESSING" } : f)));
    await new Promise((resolve) => setTimeout(resolve, 1600));
    const now = new Date().toISOString();
    const stubDocs: MedicalDocument[] = [];
    setQueue((prev) => {
      const next = prev.map((f) => {
        if (f.status === "PROCESSING") {
          stubDocs.push({
            id: f.id, patientId: "user-upload", filename: f.name, fileType: f.mimeType,
            documentType: "LAB_REPORT", reportDate: now.slice(0, 10), facilityName: "User Upload",
            rawText: "", isDemo: false, uploadedAt: now,
          });
          return { ...f, status: "UPLOADED" as UploadStatus };
        }
        return f;
      });
      try { localStorage.setItem("medlens_uploaded_reports", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    if (onAddDocuments && stubDocs.length > 0) onAddDocuments(stubDocs);
    setIsProcessing(false); setProcessSuccess(true);
  };

  const readyCount = queue.filter((f) => f.status === "READY").length;
  const uploadedCount = queue.filter((f) => f.status === "UPLOADED").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">

      {/* Header */}
      <div>
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mt-0.5">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Upload Medical Reports</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Add clinical documents to build a structured, traceable patient record.
            </p>
          </div>
        </div>
      </div>

      {/* DEMO MODE Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
        <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">DEMO MODE ACTIVE</span> — Use fictional/demo medical records only.
          Do not upload real patient information in this demo environment.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-12 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-4 cursor-pointer select-none ${
          dragActive
            ? "border-teal-400 bg-teal-500/10 scale-[0.995] shadow-lg shadow-teal-950/40"
            : "border-slate-700 bg-slate-900/40 hover:border-teal-600/60 hover:bg-slate-900/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
          dragActive ? "bg-teal-500/20 border border-teal-400/40 text-teal-300 scale-110" : "bg-teal-500/10 border border-teal-500/20 text-teal-400"
        }`}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-200">
            {dragActive ? "Release to upload" : "Drag & drop reports here"}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            or <span className="text-teal-400 font-semibold underline underline-offset-2">Browse Files</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {["PDF", "JPG", "JPEG", "PNG"].map((fmt) => (
            <span key={fmt} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">{fmt}</span>
          ))}
          <span className="text-[11px] text-slate-500">•</span>
          <span className="text-[11px] text-slate-500 font-mono">Maximum 10 MB per file</span>
        </div>
        {dragActive && <div className="absolute inset-0 rounded-2xl border-2 border-teal-400 pointer-events-none animate-pulse" />}
      </div>

      {/* Rejection Errors */}
      {rejected.length > 0 && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{rejected.length} file{rejected.length > 1 ? "s" : ""} rejected</span>
            </div>
            <button onClick={() => setRejected([])} className="text-[11px] text-slate-500 hover:text-slate-300 transition">Dismiss</button>
          </div>
          {rejected.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px] text-red-300">
              <span className="font-semibold text-red-400 shrink-0 min-w-[120px] truncate">{r.name}</span>
              <span className="text-red-300/80">— {r.reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Process Error */}
      {processError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />{processError}
        </div>
      )}

      {/* Upload Queue */}
      {queue.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
              Upload Queue
              <span className="text-slate-500 font-normal normal-case tracking-normal">
                ({queue.length} file{queue.length !== 1 ? "s" : ""})
              </span>
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              {readyCount > 0 && <span>{readyCount} ready</span>}
              {uploadedCount > 0 && <span className="text-emerald-400">{uploadedCount} accepted</span>}
            </div>
          </div>
          <div className="space-y-2">
            {queue.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition group">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                  {fileIcon(file.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[220px]">{file.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 shrink-0">
                      {file.extension || FILE_TYPE_LABEL[file.mimeType] || "FILE"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatBytes(file.size)} • Added {new Date(file.addedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <StatusBadge status={file.status} />
                <button
                  onClick={() => removeFile(file.id)}
                  disabled={file.status === "PROCESSING"}
                  title="Remove file"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-950/40 transition disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Success Banner */}
      {processSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-emerald-300">Reports accepted for clinical information extraction.</p>
          </div>
          <p className="text-xs text-emerald-400/70 pl-6">
            AI extraction will be performed in the next processing stage. No medical data has been interpreted yet.
          </p>
          <div className="pl-6">
            <button
              onClick={() => onNavigate("processing")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40"
            >
              Continue to Pipeline <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Process Button */}
      {!processSuccess && (
        <div className="flex items-center justify-between pt-1">
          <button onClick={() => onNavigate("intake")} className="text-xs text-slate-400 hover:text-slate-200 transition">
            ← Back to Intake
          </button>
          <button
            onClick={handleProcess}
            disabled={isProcessing || readyCount === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-950/40"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
            ) : (
              <><UploadCloud className="w-4 h-4" />Process Reports{readyCount > 0 && <span className="ml-1 text-xs font-normal opacity-80">({readyCount})</span>}</>
            )}
          </button>
        </div>
      )}

      {/* Uploaded Reports Section */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Uploaded Reports</h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {documents.length} document{documents.length !== 1 ? "s" : ""} in record
          </span>
        </div>
        {documents.length === 0 ? (
          <div className="py-6 text-center text-slate-600 text-xs">No documents in the patient record yet.</div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition text-xs">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-200 truncate">{doc.filename}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 shrink-0">
                      {doc.documentType.replace(/_/g, " ")}
                    </span>
                    {doc.isDemo && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40 shrink-0">DEMO</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.facilityName} • {doc.reportDate}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-emerald-950/60 text-emerald-400 border-emerald-800/60 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />IN RECORD
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Source & Provenance Info Card */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          Source &amp; Provenance Tracking
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Every data point extracted from these documents will be traced back to its exact source file and passage.
          MedLens records provenance for every observation, medication entry, and reported value — so clinicians can
          verify the origin of any structured information before acting on it.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {[
            { label: "Source tracking", desc: "File + passage" },
            { label: "Extraction method", desc: "AI-assisted (next stage)" },
            { label: "Range source", desc: "Report-provided only" },
            { label: "Verification", desc: "Human-in-the-loop" },
          ].map((item) => (
            <div key={item.label} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <p className="text-[10px] font-bold text-teal-400 mb-0.5">{item.label}</p>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 italic">
          Note: No AI extraction has been performed yet. File contents have not been read or interpreted.
          Provenance will be established during the clinical extraction stage.
        </p>
      </div>

    </div>
  );
};
