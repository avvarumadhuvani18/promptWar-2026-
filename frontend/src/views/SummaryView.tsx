import React, { useState } from "react";
import { Sparkles, HelpCircle, Copy, Check, MessageSquare, Send, ShieldCheck, BookOpen } from "lucide-react";
import { AISummary } from "@/types/clinical";

interface SummaryViewProps {
  summary: AISummary;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; source?: string }>>([
    {
      role: "assistant",
      text: "Hello Eleanor! I am your MedLens records assistant. I can answer questions strictly grounded in your verified lab results and clinic documents.",
      source: "Grounded in: Ingested Patient Records",
    },
  ]);

  const handleCopyQuestions = () => {
    const text = summary.questionsForDoctor
      .map((q, i) => `${i + 1}. ${q.question} (Reason: ${q.reason})`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userText = chatQuery.trim();
    setChatQuery("");

    let reply = "Based on your verified records, all information must be discussed with your physician.";
    let source = "Ingested Records";

    if (userText.toLowerCase().includes("medication") || userText.toLowerCase().includes("amoxicillin")) {
      reply = "Your records include active orders for Amoxicillin 500mg, Metformin 1000mg BID, Lisinopril 20mg, and Atorvastatin 40mg. Note that Amoxicillin is currently flagged for human verification due to your recorded penicillin allergy.";
      source = "St. Jude Clinic Discharge Prescription p.1 & Patient Intake";
    } else if (userText.toLowerCase().includes("hba1c") || userText.toLowerCase().includes("sugar")) {
      reply = "Your most recent Fasting Blood Glucose was 168 mg/dL and HbA1c was 8.9%, compared to your report's reference target of 4.0 - 5.6%.";
      source = "Metro General Metabolic Panel p.1";
    } else if (userText.toLowerCase().includes("kidney") || userText.toLowerCase().includes("creatinine")) {
      reply = "Your report shows Serum Creatinine of 1.85 mg/dL (reported reference range: 0.60 - 1.20 mg/dL) and eGFR of 38 mL/min.";
      source = "Metro General CMP Report p.1";
    }

    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "assistant", text: reply, source },
    ]);
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>Patient-Friendly AI Summary &amp; Ask My Records</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Informational translation of clinical records &bull; Strictly non-diagnostic and non-prescriptive.
        </p>
      </div>

      {/* Summary Narrative Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Plain-English Clinical Narrative</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            6th Grade Reading Level
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          {summary.overview}
        </p>
      </div>

      {/* Key Test Explanations */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          What Your Key Tests Mean
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {summary.plainLanguageLabs.map((lab, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5 text-xs">
              <span className="font-bold text-slate-100">{lab.testName}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{lab.whatItMeans}</p>
              <div className="text-teal-300/90 font-medium text-[11px] pt-1">
                {lab.patientStatus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions for Doctor */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Recommended Questions for Your Next Doctor Appointment
            </h3>
          </div>
          <button
            onClick={handleCopyQuestions}
            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium transition border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Questions"}</span>
          </button>
        </div>

        <div className="space-y-2">
          {summary.questionsForDoctor.map((q) => (
            <div
              key={q.id}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">{q.question}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300">
                  {q.priority}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] italic">Context: {q.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ask My Records Section */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Ask My Records (Grounded Clinical Q&amp;A)
          </h3>
        </div>

        {/* Messages */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl text-xs ${
                msg.role === "user"
                  ? "bg-teal-950/40 border border-teal-800/60 ml-12 text-teal-100"
                  : "bg-slate-950 border border-slate-800 mr-12 text-slate-200"
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
              {msg.source && (
                <span className="block text-[10px] text-slate-500 font-mono mt-1">
                  Source: {msg.source}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendQuery} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. What medications am I taking? Why is my creatinine flagged?"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          This summary and Q&amp;A assistant are informational tools designed solely to empower doctor-patient dialogue. MedLens never prescribes medication, changes dosages, or provides formal clinical diagnoses.
        </p>
      </div>
    </div>
  );
};
