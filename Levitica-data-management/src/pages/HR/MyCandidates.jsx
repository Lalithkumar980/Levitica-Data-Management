import React, { useState, useEffect, useRef } from "react";
import { Bell, Search, UserPlus, X, Save, Calendar, Pencil, Users, FileCheck, Clock, UserCheck, UserX, Upload, FileSpreadsheet, ArrowLeft, User, LogOut } from "lucide-react";
import * as XLSX from "xlsx";

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const INITIAL_CANDIDATES = [
  {
    id: 1,
    name: "Rohan Mehta",
    note: "Excellent technical skills",
    position: "Backend Developer",
    dept: "Engineering",
    interviewDate: "2025-01-10",
    came: "Yes",
    screening: "Pass",
    technical: "Pass / Virtual",
    hrRound: "Pass",
    offer: "Done",
    onboarding: "Completed",
    joiningDate: "2025-02-01",
    referredBy: { initials: "AV", name: "Amit Verma", phone: "9876543210" },
    recruiter: { initials: "PN", name: "Priya Nair" },
  },
  {
    id: 2,
    name: "Deepak Rao",
    note: null,
    position: "HR Executive",
    dept: "HR",
    interviewDate: "2025-01-18",
    came: "Yes",
    screening: "Pass",
    technical: "Pass / Virtual",
    hrRound: "Pass",
    offer: "Done",
    onboarding: "In Progress",
    joiningDate: "2025-03-01",
    referredBy: { initials: "KS", name: "Kavita Singh", phone: "9123456780" },
    recruiter: { initials: "PN", name: "Priya Nair" },
  },
  {
    id: 3,
    name: "Pooja Menon",
    note: "Final HR round scheduled",
    position: "Product Manager",
    dept: "Product",
    interviewDate: "2025-02-05",
    came: "Yes",
    screening: "Pass",
    technical: "Pass / Virtual",
    hrRound: "Pending",
    offer: "Pending",
    onboarding: null,
    joiningDate: null,
    referredBy: null,
    recruiter: { initials: "PN", name: "Priya Nair" },
  },
];

const Badge = ({ children, variant = "success" }) => {
  const classes = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${classes[variant] || classes.success}`}>
      {children}
    </span>
  );
};

/** Returns 6 segment colors for pipeline: success (done), info (in progress), warning (pending), gray (not started) */
function getPipelineSegments(c) {
  const done = "bg-success";
  const current = "bg-info";
  const pending = "bg-warning";
  const none = "bg-gray-300";
  return [
    c.screening === "Pass" ? done : c.screening ? pending : none,
    c.technical && c.technical !== "Not Yet" ? done : none,
    c.hrRound === "Pass" ? done : c.hrRound === "Pending" ? pending : none,
    c.offer === "Done" ? done : c.offer === "Pending" ? pending : none,
    c.onboarding === "Completed" ? done : c.onboarding === "In Progress" ? current : none,
    c.joiningDate ? done : none,
  ];
}

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const defaultForm = {
  fullName: "",
  positionApplied: "",
  department: "",
  interviewDate: "",
  cameForInterview: "",
  recruiter: "Priya Nair",
  screeningCall: "Not Yet",
  technicalRound: "Not Yet",
  techRoundType: "",
  hrRound: "Not Yet",
  salary: "",
  offerStatus: "",
};

function parseTechnical(technical) {
  if (!technical || technical === "Not Yet") return { round: "Not Yet", type: "" };
  const parts = String(technical).split(/\s*\/\s*/);
  return { round: parts[0] || "Not Yet", type: parts[1] || "" };
}

function AddCandidateModal({ open, onClose, onSave, candidate: editingCandidate, step, onStepChange, onBulkImport }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) return;
    if (editingCandidate) {
      const { round: technicalRound, type: techRoundType } = parseTechnical(editingCandidate.technical);
      setForm({
        fullName: editingCandidate.name || "",
        positionApplied: editingCandidate.position || "",
        department: editingCandidate.dept === "—" ? "" : (editingCandidate.dept || ""),
        interviewDate: editingCandidate.interviewDate === "—" ? "" : (editingCandidate.interviewDate || ""),
        cameForInterview: editingCandidate.came === "—" ? "" : (editingCandidate.came || ""),
        recruiter: editingCandidate.recruiter?.name || "Priya Nair",
        screeningCall: editingCandidate.screening || "Not Yet",
        technicalRound,
        techRoundType,
        hrRound: editingCandidate.hrRound || "Not Yet",
        salary: "",
        offerStatus: editingCandidate.offer === "—" ? "" : (editingCandidate.offer || ""),
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, editingCandidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recruiterName = form.recruiter || "Priya Nair";
    const technicalDisplay =
      form.technicalRound === "Not Yet"
        ? "Not Yet"
        : form.techRoundType
          ? `${form.technicalRound} / ${form.techRoundType}`
          : form.technicalRound;
    const id = editingCandidate?.id ?? Date.now();
    const onboarding =
      form.offerStatus === "Done"
        ? (editingCandidate?.onboarding === "Completed" ? "Completed" : "In Progress")
        : editingCandidate?.onboarding ?? null;
    const joiningDate = editingCandidate?.joiningDate ?? null;
    const newCandidate = {
      id,
      name: form.fullName.trim(),
      note: editingCandidate?.note ?? null,
      position: form.positionApplied.trim(),
      dept: form.department.trim() || "—",
      interviewDate: form.interviewDate || "—",
      came: form.cameForInterview || "—",
      screening: form.screeningCall,
      technical: technicalDisplay,
      hrRound: form.hrRound,
      offer: form.offerStatus || "—",
      onboarding,
      joiningDate: joiningDate || null,
      referredBy: editingCandidate?.referredBy ?? null,
      recruiter: { initials: getInitials(recruiterName), name: recruiterName },
    };
    onSave(newCandidate, !!editingCandidate);
    setForm(defaultForm);
    onClose();
  };

  if (!open) return null;

  const handleBulkImportThenClose = (candidates) => {
    onBulkImport?.(candidates);
    onClose();
  };

  if (step === "import") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-bold text-brand-dark">Import from Excel</h2>
            <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ImportCandidatesContent onImport={handleBulkImportThenClose} onClose={onClose} onBack={() => onStepChange?.("choice")} />
          </div>
        </div>
      </div>
    );
  }

  if (!editingCandidate && step === "choice") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
        <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-brand-dark">Add Candidate</h2>
            <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onStepChange?.("form")}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-brand hover:bg-brand-soft/30 transition text-left"
            >
              <span className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0">
                <UserPlus className="w-6 h-6" strokeWidth={2} />
              </span>
              <span className="font-semibold text-brand-dark">Add single candidate</span>
              <span className="text-sm text-body text-center">Add one candidate manually with the full form.</span>
            </button>
            <button
              type="button"
              onClick={() => onStepChange?.("import")}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-brand hover:bg-brand-soft/30 transition text-left"
            >
              <span className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0">
                <FileSpreadsheet className="w-6 h-6" strokeWidth={2} />
              </span>
              <span className="font-semibold text-brand-dark">Import from Excel</span>
              <span className="text-sm text-body text-center">Upload a CSV or Excel file to add many candidates at once.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border-2 border-gray-200">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingCandidate ? "Edit Candidate" : "Add Candidate"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* CANDIDATE INFORMATION */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-3">Candidate Information</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Candidate full name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Position Applied *</label>
                <input
                  type="text"
                  name="positionApplied"
                  value={form.positionApplied}
                  onChange={handleChange}
                  placeholder="e.g. Senior Developer"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Interview Date</label>
                <div className="relative">
                  <input
                    type="text"
                    name="interviewDate"
                    value={form.interviewDate}
                    onChange={handleChange}
                    placeholder="dd-mm-yyyy"
                    className={inputClass}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Came for Interview?</label>
                <select name="cameForInterview" value={form.cameForInterview} onChange={handleChange} className={inputClass}>
                  <option value="">—</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Recruiter</label>
                <select name="recruiter" value={form.recruiter} onChange={handleChange} className={inputClass}>
                  <option value="Priya Nair">Priya Nair</option>
                  <option value="Arjun Sharma">Arjun Sharma</option>
                </select>
              </div>
            </div>
          </div>

          {/* ROUND RESULTS */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-3">Round Results</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Screening Call</label>
                <select name="screeningCall" value={form.screeningCall} onChange={handleChange} className={inputClass}>
                  <option value="Not Yet">Not Yet</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Technical Round</label>
                <select name="technicalRound" value={form.technicalRound} onChange={handleChange} className={inputClass}>
                  <option value="Not Yet">Not Yet</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tech Round Type</label>
                <select name="techRoundType" value={form.techRoundType} onChange={handleChange} className={inputClass}>
                  <option value="">—</option>
                  <option value="Virtual">Virtual</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>HR Round</label>
                <select name="hrRound" value={form.hrRound} onChange={handleChange} className={inputClass}>
                  <option value="Not Yet">Not Yet</option>
                  <option value="Pass">Pass</option>
                  <option value="Pending">Pending</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            </div>
          </div>

          {/* OFFER & ONBOARDING */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-3">Offer & Onboarding</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Salary (LPA / Amount)</label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 9.5 LPA or ₹85,000/mo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Offer Status</label>
                <select name="offerStatus" value={form.offerStatus} onChange={handleChange} className={inputClass}>
                  <option value="">—</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition">
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const MAX_IMPORT_ROWS = 500;
const MAX_FILE_SIZE_MB = 5;

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if ((ch === "," && !inQuotes) || (ch === "\n" && !inQuotes)) {
        values.push(current.trim());
        current = "";
        if (ch === "\n") break;
      } else {
        current += ch;
      }
    }
    values.push(current.trim());
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] != null ? String(values[idx]).trim() : "";
    });
    rows.push(obj);
  }
  return rows;
}

function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

const HEADER_ALIASES = {
  name: ["name", "full name", "candidate name", "candidate"],
  position: ["position", "position applied", "role", "job title"],
  department: ["department", "dept"],
  "interview date": ["interview date", "date", "interview date"],
  came: ["came", "came for interview", "attended"],
  screening: ["screening", "screening call"],
  technical: ["technical", "technical round", "tech round"],
  "hr round": ["hr round", "hr round"],
  offer: ["offer", "offer status"],
  onboarding: ["onboarding"],
  "joining date": ["joining date", "joining date", "join date"],
  note: ["note", "notes"],
  "referred by": ["referred by", "referral", "referred by"],
  recruiter: ["recruiter"],
};

function mapRowToCandidate(row, headerMap, baseId) {
  const get = (key) => {
    const col = headerMap[key];
    const val = col != null && row[col] !== undefined ? String(row[col]).trim() : "";
    return val || null;
  };
  const name = get("name");
  if (!name) return null;
  const recruiterName = get("recruiter") || "Priya Nair";
  return {
    id: baseId,
    name,
    note: get("note") || null,
    position: get("position") || "—",
    dept: get("department") || "—",
    interviewDate: get("interview date") || "—",
    came: get("came") || "—",
    screening: get("screening") || "Not Yet",
    technical: get("technical") || "Not Yet",
    hrRound: get("hr round") || "Not Yet",
    offer: get("offer") || "—",
    onboarding: get("onboarding") || null,
    joiningDate: get("joining date") || null,
    referredBy: get("referred by") ? { initials: getInitials(get("referred by")), name: get("referred by"), phone: "" } : null,
    recruiter: { initials: getInitials(recruiterName), name: recruiterName },
  };
}

function buildHeaderMap(rawHeaders) {
  const normalized = rawHeaders.map((h) => normalizeHeader(h));
  const raw = [...rawHeaders];
  const getKey = (aliases) => {
    const idx = normalized.findIndex((n) => aliases.some((a) => n === a || (n && n.includes(a))));
    return idx >= 0 ? raw[idx] : null;
  };
  return {
    name: getKey(HEADER_ALIASES.name) ?? getKey(["name"]),
    position: getKey(HEADER_ALIASES.position),
    department: getKey(HEADER_ALIASES.department),
    "interview date": getKey(HEADER_ALIASES["interview date"]),
    came: getKey(HEADER_ALIASES.came),
    screening: getKey(HEADER_ALIASES.screening),
    technical: getKey(HEADER_ALIASES.technical),
    "hr round": getKey(HEADER_ALIASES["hr round"]),
    offer: getKey(HEADER_ALIASES.offer),
    onboarding: getKey(HEADER_ALIASES.onboarding),
    "joining date": getKey(HEADER_ALIASES["joining date"]),
    note: getKey(HEADER_ALIASES.Note),
    "referred by": getKey(HEADER_ALIASES["referred by"]),
    recruiter: getKey(HEADER_ALIASES.recruiter),
  };
}

/** Reusable import UI: drag-drop, preview, footer. Use in modal or inside Add Candidate flow. onBack = go back (e.g. to choice step); if absent, footer shows Cancel instead. */
function ImportCandidatesContent({ onImport, onClose, onBack }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState([]);

  const reset = () => {
    setFile(null);
    setError("");
    setParsed([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const parseFile = (fileObj) => {
    setError("");
    setParsed([]);
    const isCSV = fileObj.name.toLowerCase().endsWith(".csv");
    const isXLSX = fileObj.name.toLowerCase().endsWith(".xlsx") || fileObj.name.toLowerCase().endsWith(".xls");
    if (!isCSV && !isXLSX) {
      setError("Please upload a .csv or .xlsx file.");
      return;
    }
    if (fileObj.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let rows = [];
        let rawHeaders = [];
        if (isCSV) {
          const text = e.target?.result ?? "";
          const lines = text.split(/\r?\n/).filter((l) => l.trim());
          if (lines.length < 2) {
            setError("No valid rows found. First row should be headers.");
            return;
          }
          rawHeaders = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
          rows = parseCSV(text);
        } else {
          const data = new Uint8Array(e.target?.result);
          const wb = XLSX.read(data, { type: "array" });
          const firstSheet = wb.SheetNames[0];
          if (!firstSheet) {
            setError("No sheet found in the workbook.");
            return;
          }
          const sheet = wb.Sheets[firstSheet];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
          if (!json.length) {
            setError("No valid rows found.");
            return;
          }
          rawHeaders = json[0].map((h) => String(h ?? "").trim());
          rows = json.slice(1).map((row) => {
            const obj = {};
            rawHeaders.forEach((h, i) => {
              obj[h] = row[i] != null ? String(row[i]).trim() : "";
            });
            return obj;
          });
        }
        rows = rows.filter((r) => rawHeaders.some((h) => r[h] !== undefined && String(r[h]).trim() !== ""));
        if (rows.length > MAX_IMPORT_ROWS) {
          rows = rows.slice(0, MAX_IMPORT_ROWS);
          setError(`Only first ${MAX_IMPORT_ROWS} rows will be imported.`);
        }
        const map = buildHeaderMap(rawHeaders);
        const baseId = Date.now();
        const candidates = [];
        for (let i = 0; i < rows.length; i++) {
          const c = mapRowToCandidate(rows[i], map, baseId + i);
          if (c) candidates.push(c);
        }
        if (candidates.length === 0) {
          setError("No valid candidates found. Ensure the first column has a 'Name' (or similar) header and at least one data row.");
          return;
        }
        setParsed(candidates);
      } catch (err) {
        setError(err?.message || "Failed to parse file.");
      }
    };
    if (isCSV) reader.readAsText(fileObj);
    else reader.readAsArrayBuffer(fileObj);
  };

  const handleFileSelect = (e) => {
    const f = e.target?.files?.[0];
    if (f) {
      setFile(f);
      parseFile(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      setFile(f);
      parseFile(f);
    }
  };

  const handleImport = () => {
    if (parsed.length) {
      onImport(parsed);
      reset();
      onClose();
    }
  };

  const handleBack = () => {
    reset();
    onBack?.();
  };

  const previewCount = Math.min(10, parsed.length);

  return (
    <>
      <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          <p className="text-sm text-body">
            Upload a .csv or .xlsx file. The first row must be headers. Expected columns (case-insensitive): Name, Position, Department, Interview Date, Came, Screening, Technical, HR Round, Offer, Onboarding, Joining Date, Note, Referred By, Recruiter.
          </p>
          <button
            type="button"
            onClick={() => {
              const headers = ["Name", "Position", "Department", "Interview Date", "Came", "Screening", "Technical", "HR Round", "Offer", "Onboarding", "Joining Date", "Note", "Referred By", "Recruiter"];
              const example = ["Jane Doe", "Frontend Developer", "Engineering", "2025-03-15", "Yes", "Pass", "Pass / Virtual", "Pending", "Pending", "", "", "Referred by team lead", "Amit Verma", "Priya Nair"];
              const escape = (v) => { const s = v != null ? String(v) : ""; return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s; };
              const csv = ["\uFEFF" + headers.map(escape).join(","), example.map(escape).join(",")].join("\r\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "candidates-import-template.csv";
              a.click();
              URL.revokeObjectURL(a.href);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            <FileSpreadsheet className="w-4 h-4" strokeWidth={2} />
            Download template (CSV)
          </button>
          <label
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 px-6 cursor-pointer transition ${dragOver ? "border-brand bg-brand-soft/50" : "border-gray-200 hover:border-brand hover:bg-brand-soft/30"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={handleDrop}
          >
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileSelect} />
            <Upload className="w-10 h-10 text-gray-400 mb-2" strokeWidth={2} />
            <p className="text-sm font-medium text-brand-dark">{file ? file.name : "Drop file here or click to browse"}</p>
            <p className="text-xs text-body mt-1">Accepted .csv, .xlsx · Max {MAX_FILE_SIZE_MB} MB · Max {MAX_IMPORT_ROWS} rows</p>
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          {parsed.length > 0 && (
            <>
              <p className="text-sm font-semibold text-brand-dark">Found {parsed.length} candidate{parsed.length !== 1 ? "s" : ""}. Preview (first {previewCount}):</p>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Name</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Position</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Department</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Interview Date</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">Offer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.slice(0, previewCount).map((c, i) => (
                      <tr key={c.id} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-body truncate" title={c.name}>{c.name}</td>
                        <td className="py-2 px-3 text-body truncate" title={c.position}>{c.position}</td>
                        <td className="py-2 px-3 text-body truncate" title={c.dept}>{c.dept}</td>
                        <td className="py-2 px-3 text-body truncate">{c.interviewDate}</td>
                        <td className="py-2 px-3 text-center text-body">{c.offer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
        {onBack != null ? (
          <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back
          </button>
        ) : (
          <button type="button" onClick={handleClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">Cancel</button>
        )}
        {parsed.length > 0 ? (
          <button type="button" onClick={handleImport} className="px-4 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition text-sm">
            Import {parsed.length} candidate{parsed.length !== 1 ? "s" : ""}
          </button>
        ) : (
          <span className="text-sm text-gray-400">Upload a file to continue</span>
        )}
      </div>
    </>
  );
}

function ImportCandidatesModal({ open, onClose, onImport }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">Import from Excel / CSV</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <ImportCandidatesContent onImport={onImport} onClose={onClose} />
      </div>
    </div>
  );
}

export default function MyCandidates() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [addStep, setAddStep] = useState("choice");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setEditingCandidate(null);
    setAddStep("choice");
  };

  const handleSaveCandidate = (payload, isEdit) => {
    if (isEdit) {
      setCandidates((prev) => prev.map((c) => (c.id === payload.id ? payload : c)));
    } else {
      setCandidates((prev) => [payload, ...prev]);
    }
    setEditingCandidate(null);
    setAddModalOpen(false);
    setAddStep("choice");
  };

  const handleBulkImport = (candidatesToAdd) => {
    if (candidatesToAdd?.length) {
      setCandidates((prev) => [...candidatesToAdd, ...prev]);
    }
  };

  const openAddModal = () => {
    setEditingCandidate(null);
    setAddStep("choice");
    setAddModalOpen(true);
  };

  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setAddStep("form");
    setAddModalOpen(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <UserCheck className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Recruitment</h1>
            <p className="text-[13px] text-black/70">Track candidates through screening, technical, HR round, and offer to joining.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input
            type="search"
            placeholder="Search anything..."
            className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
          />
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <UserPlus className="w-5 h-5" strokeWidth={2} />
            Add Candidate
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                PN
              </div>
             
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      PN
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">Priya Nair</p>
                      <p className="text-xs font-medium text-black/70">HR Recruiter</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">priya.nair@company.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left">
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    My Profile
                  </button>
                  <button type="button" onClick={() => (window.location.href = "/")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left">
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <AddCandidateModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveCandidate}
        candidate={editingCandidate}
        step={addStep}
        onStepChange={setAddStep}
        onBulkImport={handleBulkImport}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Summary cards - same style as Finance */}
        {(() => {
          const total = candidates.length;
          const came = candidates.filter((c) => c.came === "Yes").length;
          const offersDone = candidates.filter((c) => c.offer === "Done").length;
          const offerPending = candidates.filter((c) => c.offer === "Pending").length;
          const joined = candidates.filter((c) => c.onboarding === "Completed").length;
          const rejected = candidates.filter((c) => c.offer === "Rejected").length;
          const cameRate = total ? Math.round((came / total) * 100) : 0;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total</p>
                    <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{total}</p>
                    <p className="text-xs font-medium text-blue-700/80 mt-1.5">Candidates</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6 text-blue-700" strokeWidth={2} />
                  </span>
                </div>
              </div>
              <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Came for Interview</p>
                    <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{came}</p>
                    <p className="text-xs font-medium text-teal-700/80 mt-1.5">{cameRate}% rate</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCheck className="w-6 h-6 text-teal-700" strokeWidth={2} />
                  </span>
                </div>
              </div>
              <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Offers Done</p>
                    <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{offersDone}</p>
                    <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Accepted</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileCheck className="w-6 h-6 text-emerald-700" strokeWidth={2} />
                  </span>
                </div>
              </div>
              <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Offer Pending</p>
                    <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{offerPending}</p>
                    <p className="text-xs font-medium text-amber-700/80 mt-1.5">Awaiting response</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="w-6 h-6 text-amber-700" strokeWidth={2} />
                  </span>
                </div>
              </div>
              <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Joined</p>
                    <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">{joined}</p>
                    <p className="text-xs font-medium text-violet-700/80 mt-1.5">Onboarded</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCheck className="w-6 h-6 text-violet-700" strokeWidth={2} />
                  </span>
                </div>
              </div>
              <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Rejected</p>
                    <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{rejected}</p>
                    <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserX className="w-6 h-6 text-red-700" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* All Candidates table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-transparent flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-black">All Candidates</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search name, position, r..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>All Stages</option>
              </select>
              <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>All Offers</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1100px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Candidate</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Position / Dept</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Interview Date</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Came</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Screening</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Technical</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">HR Round</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Offer</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Onboarding</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Joining Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Referred By</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Recruiter</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Pipeline</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                    <td className="py-3 px-3 text-right tabular-nums">{i + 1}</td>
                    <td className="py-3 px-3 max-w-[220px]">
                      <span className="font-medium text-black block truncate" title={c.name}>{c.name}</span>
                      {c.note && <span className="text-xs text-black block truncate mt-0.5" title={c.note}>{c.note}</span>}
                    </td>
                    <td className="py-3 px-3 max-w-[180px]">
                      <span className="font-medium text-black block truncate" title={c.position}>{c.position}</span>
                      <span className="text-xs text-black block truncate mt-0.5" title={c.dept}>{c.dept}</span>
                    </td>
                    <td className="py-3 px-3 text-black whitespace-nowrap">{c.interviewDate}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap"><Badge>{c.came}</Badge></td>
                    <td className="py-3 px-3 text-center whitespace-nowrap"><Badge>{c.screening}</Badge></td>
                    <td className="py-3 px-3 text-center whitespace-nowrap"><Badge>{c.technical}</Badge></td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <Badge variant={c.hrRound === "Pending" ? "warning" : "success"}>{c.hrRound}</Badge>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <Badge variant={c.offer === "Pending" ? "warning" : "success"}>{c.offer}</Badge>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {c.onboarding ? (
                        <Badge variant={c.onboarding === "In Progress" ? "info" : "success"}>{c.onboarding}</Badge>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-black whitespace-nowrap">{c.joiningDate || "—"}</td>
                    <td className="py-3 px-3 max-w-[160px]">
                      {c.referredBy ? (
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success font-semibold text-[10px] shrink-0">{c.referredBy.initials}</span>
                          <span className="min-w-0">
                            <span className="font-medium text-black text-xs block truncate" title={c.referredBy.name}>{c.referredBy.name}</span>
                            <span className="text-black text-xs block truncate mt-0.5" title={c.referredBy.phone}>{c.referredBy.phone}</span>
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 max-w-[140px]">
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success font-semibold text-[10px] shrink-0">{c.recruiter.initials}</span>
                        <span className="font-medium text-black text-xs truncate" title={c.recruiter.name}>{c.recruiter.name}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {getPipelineSegments(c).map((color, idx) => (
                          <span key={idx} className={`w-2 h-5 rounded-sm shrink-0 ${color}`} title={["Screening", "Technical", "HR Round", "Offer", "Onboarding", "Joined"][idx]} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit candidate"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
