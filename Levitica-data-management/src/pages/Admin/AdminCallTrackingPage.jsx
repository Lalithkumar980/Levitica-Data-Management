import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Calendar,
  Phone,
  CheckCircle,
  Voicemail,
  PhoneOff,
  Mic,
  Percent,
} from "lucide-react";

const ACTIVITY_TYPES = ["Call", "Email", "Meeting"];
const CALL_OUTCOMES = ["—", "Voicemail", "Connected - Interested", "Callback Requested", "No Answer", "Other"];
const REPS = [
  { name: "Priya Nair", initials: "PN" },
  { name: "Vikram Joshi", initials: "VJ" },
  { name: "Meena Reddy", initials: "MR" },
  { name: "Aditya Kumar", initials: "AK" },
  { name: "Kavya Shah", initials: "KS" },
];
const LINKED_DEALS = ["— None —", "TechNova Enterprise License", "GreenPath Consulting Module", "Horizon Retail Integration", "MediCore Healthcare Module", "EduLeap Education Suite", "FinPlex SaaS Starter"];
const LINKED_CONTACTS = ["— None —", "Suresh Rajan", "Meena Joshi", "Deepak Verma", "Priya Nair", "Arun Krishnan"];
const FOLLOW_UP_TYPES = ["Call", "Email", "Meeting", "Follow-up"];

const OUTCOME_STYLES = {
  "Voicemail": "bg-amber-100 text-amber-700",
  "Callback Requested": "bg-blue-100 text-blue-700",
  "Connected - Interested": "bg-emerald-100 text-emerald-700",
  "No Answer": "bg-red-100 text-red-700",
};

const INITIAL_CALLS = [
  { id: 1, date: "2025-02-15", subject: "Follow-up - GreenPath", company: "GreenPath Solutions", outcome: "Voicemail", duration: "", rep: "Meena Reddy", repInitials: "MR", deal: "GreenPath Consulting Module", notes: "Left voicemail. Will try again tomorrow.", recording: "None" },
  { id: 2, date: "2025-02-10", subject: "Negotiation Call - Horizon", company: "Horizon Retail Co", outcome: "Callback Requested", duration: "18min", rep: "Vikram Joshi", repInitials: "VJ", deal: "Horizon Retail Integration", notes: "Discussed 10% volume discount. Sending revised proposal.", recording: "None" },
  { id: 3, date: "2025-01-15", subject: "Initial Discovery Call", company: "TechNova Pvt Ltd", outcome: "Connected - Interested", duration: "25min", rep: "Vikram Joshi", repInitials: "VJ", deal: "TechNova Enterprise License", notes: "Client interested in enterprise plan. Demo scheduled.", recording: "None" },
];

const initialLogForm = {
  activityType: "Call",
  date: "",
  subject: "",
  company: "",
  duration: "0",
  callOutcome: "—",
  rep: "Priya Nair",
  linkedDeal: "— None —",
  linkedContact: "— None —",
  callRecording: "",
  notes: "",
  scheduleFollowUp: "",
  followUpType: "Call",
};

export default function AdminCallTrackingPage() {
  const [calls, setCalls] = useState(INITIAL_CALLS);
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("All Outcomes");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [logForm, setLogForm] = useState(initialLogForm);
  const [editingCall, setEditingCall] = useState(null);

  const filtered = calls.filter((row) => {
    const matchSearch =
      !search ||
      row.subject.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.deal.toLowerCase().includes(search.toLowerCase());
    const matchOutcome = outcomeFilter === "All Outcomes" || row.outcome === outcomeFilter;
    return matchSearch && matchOutcome;
  });

  const connectedCount = calls.filter((c) => c.outcome === "Connected - Interested" || c.outcome?.startsWith("Connected")).length;
  const voicemailCount = calls.filter((c) => c.outcome === "Voicemail").length;
  const noAnswerCount = calls.filter((c) => c.outcome === "No Answer").length;
  const withRecording = calls.filter((c) => c.recording && c.recording !== "None").length;
  const connectRate = calls.length ? Math.round((connectedCount / calls.length) * 100) : 0;

  const handleDelete = (id) => {
    setCalls((prev) => prev.filter((c) => c.id !== id));
    toast.success("Call log deleted");
  };

  const openEditCall = (row) => {
    setLogForm({
      activityType: "Call",
      date: row.date ? row.date.split("-").reverse().join("-") : "",
      subject: row.subject || "",
      company: row.company || "",
      duration: row.duration || "0",
      callOutcome: row.outcome || "—",
      rep: row.rep || "Priya Nair",
      linkedDeal: row.deal === "—" ? "— None —" : row.deal || "— None —",
      linkedContact: "— None —",
      callRecording: row.recording || "",
      notes: row.notes || "",
      scheduleFollowUp: "",
      followUpType: "Call",
    });
    setEditingCall(row);
    setAddModalOpen(true);
  };

  const toYyyyMmDd = (ddMmYyyy) => {
    if (!ddMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(ddMmYyyy)) return ddMmYyyy || "";
    const [d, m, y] = ddMmYyyy.split("-");
    return `${y}-${m}-${d}`;
  };

  const handleLogFormChange = (field, value) => {
    setLogForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLog = () => {
    const { activityType, date, subject, company, duration, callOutcome, rep, linkedDeal, callRecording, notes } = logForm;
    if (!subject.trim() || !notes.trim()) return;
    const repEntry = REPS.find((r) => r.name === rep) || REPS[0];
    const callDate = toYyyyMmDd(date) || new Date().toISOString().slice(0, 10);
    const deal = linkedDeal === "— None —" ? "—" : linkedDeal;
    const outcome = callOutcome === "—" ? "" : callOutcome;
    const durationDisplay = duration && duration !== "0" ? `${duration}min` : "";
    const payload = {
      date: callDate,
      subject: subject.trim(),
      company: company.trim() || "—",
      outcome: outcome || "—",
      duration: durationDisplay,
      rep: repEntry.name,
      repInitials: repEntry.initials,
      deal: deal || "—",
      notes: notes.trim(),
      recording: callRecording.trim() || "None",
    };
    if (editingCall) {
      setCalls((prev) => prev.map((c) => (c.id === editingCall.id ? { ...payload, id: c.id } : c)));
      setEditingCall(null);
      toast.success("Call log updated successfully");
    } else {
      setCalls((prev) => [{ ...payload, id: Math.max(0, ...calls.map((c) => c.id)) + 1 }, ...prev]);
      toast.success("Call log added successfully");
    }
    setLogForm(initialLogForm);
    setAddModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setLogForm(initialLogForm);
    setEditingCall(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">Call Tracking</h1>
          <p className="text-sm text-body">/ Manual Call Log</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search CRM..."
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
            onClick={() => { setEditingCall(null); setLogForm(initialLogForm); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Log
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Six summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Total Calls</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">{calls.length}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider mb-1.5">Connected</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">{connectedCount}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Voicemail</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">{voicemailCount}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Voicemail className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">No Answer</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">{noAnswerCount}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PhoneOff className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Recordings</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">{withRecording}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Connect Rate</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{connectRate}%</p>
                <p className="text-xs text-gray-500 mt-1.5">Rate</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Percent className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Call Log table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-brand-dark mb-4">Call Log</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search calls..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
              />
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Outcomes</option>
                <option>Voicemail</option>
                <option>Callback Requested</option>
                <option>Connected - Interested</option>
                <option>No Answer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1000px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Subject</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Outcome</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Duration</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Rep</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Deal</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Notes</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Recording</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3 text-body tabular-nums whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.subject}>{row.subject}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${OUTCOME_STYLES[row.outcome] || "bg-gray-100 text-gray-700"}`}>
                        {row.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body tabular-nums">{row.duration || "—"}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.repInitials}
                        </span>
                        <span className="text-body truncate min-w-0" title={row.rep}>{row.rep}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.deal}>{row.deal}</td>
                    <td className="py-3 px-3 text-body min-w-0 truncate" title={row.notes}>
                      {row.notes || "—"}
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.recording}>{row.recording || "—"}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCall(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit call"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete call"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-body text-sm">No calls match your filters.</div>
          )}
        </div>
      </div>

      {/* Log Activity Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingCall ? "Edit Call Log" : "Log Activity"}</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-6">
              {/* Activity Details */}
              <div>
                <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Activity Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Activity type *</label>
                    <select
                      value={logForm.activityType}
                      onChange={(e) => handleLogFormChange("activityType", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {ACTIVITY_TYPES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Date *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={logForm.date}
                        onChange={(e) => handleLogFormChange("date", e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Subject *</label>
                    <input
                      type="text"
                      value={logForm.subject}
                      onChange={(e) => handleLogFormChange("subject", e.target.value)}
                      placeholder="Brief activity title"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                    <input
                      type="text"
                      value={logForm.company}
                      onChange={(e) => handleLogFormChange("company", e.target.value)}
                      placeholder="Company name"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Duration (mins)</label>
                    <input
                      type="text"
                      value={logForm.duration}
                      onChange={(e) => handleLogFormChange("duration", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Call outcome</label>
                    <select
                      value={logForm.callOutcome}
                      onChange={(e) => handleLogFormChange("callOutcome", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {CALL_OUTCOMES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Rep</label>
                    <select
                      value={logForm.rep}
                      onChange={(e) => handleLogFormChange("rep", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {REPS.map((r) => (
                        <option key={r.initials} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked deal</label>
                    <select
                      value={logForm.linkedDeal}
                      onChange={(e) => handleLogFormChange("linkedDeal", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {LINKED_DEALS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked contact</label>
                    <select
                      value={logForm.linkedContact}
                      onChange={(e) => handleLogFormChange("linkedContact", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {LINKED_CONTACTS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Call recording (filename)</label>
                    <input
                      type="text"
                      value={logForm.callRecording}
                      onChange={(e) => handleLogFormChange("callRecording", e.target.value)}
                      placeholder="call-recording-01.mp3"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes *</label>
                    <textarea
                      value={logForm.notes}
                      onChange={(e) => handleLogFormChange("notes", e.target.value)}
                      placeholder="Notes"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-y min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
              {/* Follow-up Task */}
              <div>
                <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Follow-up Task</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Schedule follow-up</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={logForm.scheduleFollowUp}
                        onChange={(e) => handleLogFormChange("scheduleFollowUp", e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Follow-up type</label>
                    <select
                      value={logForm.followUpType}
                      onChange={(e) => handleLogFormChange("followUpType", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {FOLLOW_UP_TYPES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLog}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingCall ? "Save changes" : "Save Activity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
