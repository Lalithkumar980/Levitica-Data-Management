import React, { useState, useEffect } from "react";
import { Bell, Phone, Plus, Pencil, Trash2, X, Save, Calendar } from "lucide-react";

const inputClass =
  "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function LogCallModal({ open, onClose, onSave, onSaveFollowUpTask, call: editingCall }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    subject: "",
    company: "",
    duration: "0",
    outcome: "",
    rep: "Vikram Joshi",
    deal: "",
    contact: "",
    recording: "",
    notes: "",
    scheduleFollowUp: "",
    followUpType: "Call",
  });

  useEffect(() => {
    if (!open) return;
    if (editingCall) {
      const dur = editingCall.duration === "-" ? "0" : String(editingCall.duration).replace(/\D/g, "") || "0";
      setForm({
        date: editingCall.date || new Date().toISOString().slice(0, 10),
        subject: editingCall.subject || "",
        company: editingCall.company === "-" ? "" : (editingCall.company || ""),
        duration: dur,
        outcome: editingCall.outcome === "-" ? "" : (editingCall.outcome || ""),
        rep: editingCall.rep || "Vikram Joshi",
        deal: editingCall.deal === "-" ? "" : (editingCall.deal || ""),
        contact: "",
        recording: editingCall.recording === "None" ? "" : (editingCall.recording || ""),
        notes: editingCall.notes || "",
        scheduleFollowUp: "",
        followUpType: "Call",
      });
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        subject: "",
        company: "",
        duration: "0",
        outcome: "",
        rep: "Vikram Joshi",
        deal: "",
        contact: "",
        recording: "",
        notes: "",
        scheduleFollowUp: "",
        followUpType: "Call",
      });
    }
  }, [open, editingCall]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject?.trim() || !form.date || !form.notes?.trim()) return;
    const newCall = {
      id: editingCall?.id ?? Date.now(),
      date: form.date,
      subject: form.subject.trim(),
      company: form.company?.trim() || "-",
      outcome: form.outcome || "-",
      duration: form.duration ? `${form.duration}min` : "-",
      rep: form.rep,
      repInitials: getInitials(form.rep),
      deal: form.deal || "-",
      notes: form.notes?.trim() || "",
      recording: form.recording?.trim() || "None",
    };
    onSave(newCall, !!editingCall);

    if (onSaveFollowUpTask && form.scheduleFollowUp) {
      onSaveFollowUpTask({
        id: Date.now() + 1,
        type: form.followUpType,
        subject: `Follow-up: ${form.subject.trim()}`,
        company: form.company?.trim() || "-",
        dueDate: form.scheduleFollowUp,
        priority: "Medium",
        status: "Pending",
        rep: form.rep,
        repInitials: getInitials(form.rep),
        deal: form.deal || "-",
      });
    }

    setForm({
      date: new Date().toISOString().slice(0, 10),
      subject: "",
      company: "",
      duration: "0",
      outcome: "",
      rep: "Vikram Joshi",
      deal: "",
      contact: "",
      recording: "",
      notes: "",
      scheduleFollowUp: "",
      followUpType: "Call",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingCall ? "Edit Call" : "Log Call"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4">Call Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Date *</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass + " pr-10"}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Duration (Mins)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className={inputClass}
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Subject *</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief activity title"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Call Outcome</label>
              <select name="outcome" value={form.outcome} onChange={handleChange} className={inputClass}>
                <option value="">—</option>
                <option>Connected - Interested</option>
                <option>Callback Requested</option>
                <option>No Answer</option>
                <option>Voicemail</option>
                <option>Not Interested</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Rep</label>
              <select name="rep" value={form.rep} onChange={handleChange} className={inputClass}>
                <option>Vikram Joshi</option>
                <option>Arjun Sharma</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Linked Deal</label>
              <select name="deal" value={form.deal} onChange={handleChange} className={inputClass}>
                <option value="">— None —</option>
                <option>Horizon Retail Integration</option>
                <option>TechNova Enterprise License</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Call Recording (Filename)</label>
            <input
              type="text"
              name="recording"
              value={form.recording}
              onChange={handleChange}
              placeholder="e.g. call-recording-01.mp3"
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>Notes *</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Activity notes..."
              className={inputClass + " min-h-[100px] resize-y"}
              required
            />
          </div>

          {/* Follow-Up Task Section */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4">Follow-Up Task</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Schedule Follow-Up</label>
                <div className="relative">
                  <input
                    type="date"
                    name="scheduleFollowUp"
                    value={form.scheduleFollowUp}
                    onChange={handleChange}
                    className={inputClass + " pr-10"}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Follow-Up Type</label>
                <select name="followUpType" value={form.followUpType} onChange={handleChange} className={inputClass}>
                  <option>Call</option>
                  <option>Follow-up</option>
                  <option>Email</option>
                  <option>Meeting</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const INITIAL_CALLS = [
  {
    id: 1,
    date: "2025-02-18",
    subject: "Negotiation Call - Horizon",
    company: "Horizon Retail Co",
    outcome: "Callback Requested",
    duration: "18min",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    deal: "Horizon Retail Integration",
    notes: "Discussed 10% volume discount. VP confirmed will c...",
    recording: "None",
  },
  {
    id: 2,
    date: "2025-01-15",
    subject: "Initial Discovery Call",
    company: "TechNova Pvt Ltd",
    outcome: "Connected - Interested",
    duration: "25min",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    deal: "TechNova Enterprise License",
    notes: "Client interested in enterprise plan. Budget con f...",
    recording: "None",
  },
];

export default function LogCallPage() {
  const [calls, setCalls] = useState(INITIAL_CALLS);
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("All Outcomes");
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingCall, setEditingCall] = useState(null);

  const handleSaveCall = (c, isEdit) => {
    if (isEdit) {
      setCalls((prev) => prev.map((x) => (x.id === c.id ? c : x)));
    } else {
      setCalls((prev) => [c, ...prev]);
    }
    setEditingCall(null);
    setShowLogModal(false);
  };

  const handleDeleteCall = (id) => {
    if (window.confirm("Are you sure you want to delete this call?")) {
      setCalls((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const filtered = calls.filter((row) => {
    const matchSearch =
      !search ||
      row.subject?.toLowerCase().includes(search.toLowerCase()) ||
      row.company?.toLowerCase().includes(search.toLowerCase()) ||
      row.deal?.toLowerCase().includes(search.toLowerCase());
    const matchOutcome = outcomeFilter === "All Outcomes" || row.outcome === outcomeFilter;
    return matchSearch && matchOutcome;
  });

  const totalCalls = calls.length;
  const connected = calls.filter((c) => c.outcome === "Connected - Interested").length;
  const voicemail = calls.filter((c) => c.outcome === "Voicemail").length;
  const noAnswer = calls.filter((c) => c.outcome === "No Answer").length;
  const recordings = calls.filter((c) => c.recording && c.recording !== "None").length;
  const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Phone className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Call Tracking</h1>
            <p className="text-sm text-body leading-snug">Log and track calls and call outcomes.</p>
          </div>
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
            onClick={() => { setEditingCall(null); setShowLogModal(true); }}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Log Call
          </button>
        </div>
      </header>

      <LogCallModal
        open={showLogModal}
        onClose={() => { setShowLogModal(false); setEditingCall(null); }}
        onSave={handleSaveCall}
        call={editingCall}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Call statistics - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Total Calls</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{totalCalls}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Connected</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">{connected}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Voicemail</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">{voicemail}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">No Answer</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">{noAnswer}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Recordings</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">{recordings}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-violet-600" strokeWidth={2} />
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
                <Calendar className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Call Log table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Phone className="w-5 h-5 text-brand" strokeWidth={2} />
              Call Log
            </h2>
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
                <option>Connected - Interested</option>
                <option>Callback Requested</option>
                <option>No Answer</option>
                <option>Voicemail</option>
                <option>Not Interested</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1000px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Subject</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Outcome</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Duration</th>
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
                    <td className="py-3 px-3 text-right text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.subject}>{row.subject}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {row.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-body tabular-nums">{row.duration}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                          {row.repInitials}
                        </span>
                        <span className="text-body truncate" title={row.rep}>{row.rep}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.deal}>{row.deal}</td>
                    <td className="py-3 px-3 text-body truncate max-w-0" title={row.notes}>{row.notes}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.recording}>{row.recording}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingCall(row); setShowLogModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit call"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCall(row.id)}
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
    </>
  );
}
