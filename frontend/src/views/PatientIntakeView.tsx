import React, { useState, useEffect } from "react";
import {
  UserPlus,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  ArrowRight,
  UploadCloud,
  LayoutDashboard,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { PatientProfile, ActiveScreen, PatientAllergy, PatientCondition } from "@/types/clinical";

interface PatientIntakeViewProps {
  patient: PatientProfile;
  onUpdatePatient: (updated: PatientProfile) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

interface ValidationErrors {
  fullName?: string;
  dob?: string;
  age?: string;
  gender?: string;
}

export const PatientIntakeView: React.FC<PatientIntakeViewProps> = ({
  patient,
  onUpdatePatient,
  onNavigate,
}) => {
  // Mode: "form" | "success"
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form State (SECTION 1: Personal Information)
  const [fullName, setFullName] = useState(patient.fullName || "");
  const [dob, setDob] = useState(patient.dob || "");
  const [age, setAge] = useState<string>(patient.age ? String(patient.age) : "");
  const [gender, setGender] = useState<string>(patient.gender || "Female");
  const [bloodGroup, setBloodGroup] = useState<string>(patient.bloodGroup || "A+");

  // Form State (SECTION 2: Clinical Information)
  const [symptomsInput, setSymptomsInput] = useState<string>(
    patient.symptoms ? patient.symptoms.join("\n") : ""
  );

  const [conditions, setConditions] = useState<PatientCondition[]>(
    patient.conditions || []
  );
  const [newConditionInput, setNewConditionInput] = useState("");

  const [allergies, setAllergies] = useState<PatientAllergy[]>(
    patient.allergies || []
  );
  const [newAllergySubstance, setNewAllergySubstance] = useState("");
  const [newAllergyReaction, setNewAllergyReaction] = useState("");
  const [newAllergySeverity, setNewAllergySeverity] = useState<"Severe" | "Moderate" | "Mild">("Severe");

  const [medicationsInput, setMedicationsInput] = useState<string>(
    patient.currentMedications ? patient.currentMedications.join("\n") : ""
  );

  const [otherNotes, setOtherNotes] = useState<string>(patient.otherNotes || "");

  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-calculate age when DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    setTouched((prev) => ({ ...prev, dob: true }));

    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge <= 130) {
        setAge(String(calculatedAge));
      }
    }
  };

  // Validation logic
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full name is required
    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters.";
    }

    // DOB validation
    if (!dob) {
      newErrors.dob = "Date of Birth is required.";
    } else {
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
        newErrors.dob = "Please select a valid past date of birth.";
      }
    }

    // Age validation
    const numAge = parseInt(age, 10);
    if (age === "" || isNaN(numAge)) {
      newErrors.age = "Age is required.";
    } else if (numAge < 0 || numAge > 130) {
      newErrors.age = "Age must be a reasonable non-negative value (0 - 130).";
    }

    // Sex validation
    if (!gender) {
      newErrors.gender = "Please select sex.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add allergy handler
  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergySubstance.trim()) return;
    const newAllergy: PatientAllergy = {
      id: `alg-${Date.now()}`,
      substance: newAllergySubstance.trim(),
      reaction: newAllergyReaction.trim() || "Unspecified reaction",
      severity: newAllergySeverity,
      provenanceType: "USER_PROVIDED",
    };
    setAllergies((prev) => [...prev, newAllergy]);
    setNewAllergySubstance("");
    setNewAllergyReaction("");
  };

  // Remove allergy
  const handleRemoveAllergy = (id: string) => {
    setAllergies((prev) => prev.filter((a) => a.id !== id));
  };

  // Add condition handler
  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConditionInput.trim()) return;
    const newCondition: PatientCondition = {
      id: `cond-${Date.now()}`,
      name: newConditionInput.trim(),
      status: "ACTIVE",
      provenanceType: "USER_PROVIDED",
    };
    setConditions((prev) => [...prev, newCondition]);
    setNewConditionInput("");
  };

  // Remove condition
  const handleRemoveCondition = (id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      dob: true,
      age: true,
      gender: true,
    });

    if (!validate()) {
      return;
    }

    // Parse multiline symptoms & medications
    const parsedSymptoms = symptomsInput
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedMedications = medicationsInput
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const updatedProfile: PatientProfile = {
      ...patient,
      fullName: fullName.trim(),
      dob,
      age: parseInt(age, 10),
      gender: gender as any,
      bloodGroup,
      symptoms: parsedSymptoms,
      conditions,
      allergies,
      currentMedications: parsedMedications,
      otherNotes: otherNotes.trim(),
      isDemo: patient.isDemo, // Preserve demo flag if modifying demo
      updatedAt: new Date().toISOString(),
    };

    // Save to App state & localStorage for session persistence
    onUpdatePatient(updatedProfile);
    try {
      localStorage.setItem("medlens_patient_profile", JSON.stringify(updatedProfile));
    } catch (err) {
      console.warn("localStorage write skipped:", err);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Patient Intake Portal
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-600/60 text-teal-300 font-mono font-medium">
              Provenance: USER_PROVIDED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capture structured self-reported demographics, clinical symptoms, and medical history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            MRN: {patient.mrn}
          </span>
        </div>
      </div>

      {/* Safety & Non-Diagnostic Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-emerald-400 font-semibold">User-Provided Data Guarantee:</strong>{" "}
          All information collected on this page represents patient self-reported data (<code className="text-teal-300 font-mono">USER_PROVIDED</code>). MedLens does not infer clinical facts, generate medical diagnoses, or recommend treatment regimens.
        </div>
      </div>

      {/* SUCCESS STATE CARD */}
      {isSubmitted ? (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/50 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Patient information saved
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The patient profile for <strong className="text-slate-200">{fullName}</strong> has been successfully recorded as <span className="text-teal-300 font-mono">USER_PROVIDED</span> and is available throughout your clinical workspace.
            </p>
          </div>

          {/* Intake Overview Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Patient Name</span>
              <strong className="text-slate-100">{fullName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">DOB / Age</span>
              <span className="text-slate-300 font-mono">{dob} ({age}y)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Sex / Blood</span>
              <span className="text-slate-300">{gender}, {bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Allergies</span>
              <span className="text-rose-400 font-bold">{allergies.length} Recorded</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("dashboard")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-teal-950/40"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate("upload")}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-teal-400" />
              <span>Upload Medical Reports</span>
            </button>

            <button
              onClick={() => setIsSubmitted(false)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Patient Information</span>
            </button>
          </div>
        </div>
      ) : (
        /* INTAKE FORM */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1 — Personal Information */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Section 1 &mdash; Personal Information
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                * Indicates required field
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 text-xs">
              {/* Full Name */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                  className={`w-full p-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 font-medium ${
                    errors.fullName && touched.fullName
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                  }`}
                />
                {errors.fullName && touched.fullName && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="sm:col-span-1 lg:col-span-3">
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Date of Birth <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, dob: true }))}
                  className={`w-full p-2.5 rounded-xl bg-slate-950 border text-slate-100 font-mono focus:outline-none focus:ring-1 ${
                    errors.dob && touched.dob
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                  }`}
                />
                {errors.dob && touched.dob && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.dob}</span>
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Age <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="130"
                  placeholder="e.g. 62"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, age: true }))}
                  className={`w-full p-2.5 rounded-xl bg-slate-950 border text-slate-100 font-mono focus:outline-none focus:ring-1 ${
                    errors.age && touched.age
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                  }`}
                />
                {errors.age && touched.age && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.age}</span>
                  </p>
                )}
              </div>

              {/* Sex */}
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Sex <span className="text-rose-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Blood Group */}
              <div className="sm:col-span-1 lg:col-span-1">
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2 — Clinical Information */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Section 2 &mdash; Clinical Information
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Patient Self-Reported
              </span>
            </div>

            {/* Symptoms Field */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">
                Symptoms
              </label>
              <textarea
                rows={2}
                placeholder="Describe the symptoms reported by the patient"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed"
              />
              <p className="text-[11px] text-slate-500">
                Tip: Enter one symptom per line (e.g., Fatigue, localized dental molar throbbing).
              </p>
            </div>

            {/* Existing Conditions Field */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-semibold block">
                Existing Conditions
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes Mellitus, Essential Hypertension"
                  value={newConditionInput}
                  onChange={(e) => setNewConditionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCondition(e);
                    }
                  }}
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                  <span>Add Condition</span>
                </button>
              </div>

              {/* Tag list */}
              {conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {conditions.map((cond) => (
                    <span
                      key={cond.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>{cond.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(cond.id)}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Allergies Field */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-semibold block">
                  Allergies
                </label>
                <span className="text-[11px] text-rose-400 font-mono">
                  Crucial for Discrepancy &amp; Contraindication Checks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="List known allergies, if provided (e.g. Penicillin, Sulfa)"
                  value={newAllergySubstance}
                  onChange={(e) => setNewAllergySubstance(e.target.value)}
                  className="sm:col-span-5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="Reaction (e.g. Anaphylaxis, Severe rash)"
                  value={newAllergyReaction}
                  onChange={(e) => setNewAllergyReaction(e.target.value)}
                  className="sm:col-span-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
                <select
                  value={newAllergySeverity}
                  onChange={(e) => setNewAllergySeverity(e.target.value as any)}
                  className="sm:col-span-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                >
                  <option value="Severe">Severe</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Mild">Mild</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="sm:col-span-1 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {/* Allergy List */}
              {allergies.length > 0 && (
                <div className="space-y-2 pt-1">
                  {allergies.map((alg) => (
                    <div
                      key={alg.id}
                      className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <strong className="text-rose-200 font-bold">{alg.substance}</strong>
                        <span className="text-slate-400">&bull; {alg.reaction}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono">
                          {alg.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          (USER_PROVIDED)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(alg.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Medications Field */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">
                Current Medications
              </label>
              <textarea
                rows={2}
                placeholder="List current medications, dosages, or regimens reported by the patient"
                value={medicationsInput}
                onChange={(e) => setMedicationsInput(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Tip: Enter one medication per line (e.g., Metformin 1000mg BID with meals).
              </p>
            </div>

            {/* Other Relevant Information Field */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">
                Other Relevant Information
              </label>
              <textarea
                rows={2}
                placeholder="Any other background, family history, or notes reported by the patient"
                value={otherNotes}
                onChange={(e) => setOtherNotes(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Form Actions & Save Patient Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>All entered data is strictly stamped as USER_PROVIDED</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Patient</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
