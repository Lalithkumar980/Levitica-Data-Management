import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Info,
  X,
  Save,
  Calendar,
  Mail,
  Link2,
} from "lucide-react";

const REPS = [
  { name: "Priya Nair", initials: "PN" },
  { name: "Vikram Joshi", initials: "VJ" },
  { name: "Meena Reddy", initials: "MR" },
  { name: "Aditya Kumar", initials: "AK" },
  { name: "Kavya Shah", initials: "KS" },
];
const LINKED_DEALS = ["— None —", "TechNova Enterprise License", "GreenPath Consulting Module", "Horizon Retail Integration", "MediCore Healthcare Module", "EduLeap Education Suite", "FinPlex SaaS Starter"];

const initialEmailForm = {
  subject: "",
  date: "",
  company: "",
  rep: "Priya Nair",
  linkedDeal: "— None —",
  notes: "",
};

const INITIAL_EMAILS = [
  { id: 1, date: "2025-02-18", subject: "Proposal Sent - GreenPath", company: "GreenPath Solutions", rep: "Meena Reddy", repInitials: "MR", deal: "GreenPath Consulting Module", notes: "Emailed proposal with payment terms and timeline. Awaiting response." },
  { id: 2, date: "2025-01-16", subject: "Proposal Follow-up Email", company: "TechNova Pvt Ltd", rep: "Vikram Joshi", repInitials: "VJ", deal: "TechNova Enterprise License", notes: "Sent detailed pricing sheet and implementation timeline. Follow-up call scheduled." },
];

export default function AdminEmailLogPage() {
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState(initialEmailForm);
  const [editingEmail, setEditingEmail] = useState(null);

  const filtered = emails.filter(
    (row) =>
      !search ||
      row.subject.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.deal.toLowerCase().includes(search.toLowerCase())
  );

  const thisMonth = emails.filter((e) => {
    const [y, m] = e.date.split("-").map(Number);
    const now = new Date();
    return y === now.getFullYear() && m === now.getMonth() + 1;
  }).length;

  const linkedToDeals = emails.filter((e) => e.deal).length;

  const handleDelete = (id) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    toast.success("Email log deleted");
  };

  const openEditEmail = (row) => {
    setEmailForm({
      subject: row.subject || "",
      date: row.date ? row.date.split("-").reverse().join("-") : "",
      company: row.company || "",
      rep: row.rep || "Priya Nair",
      linkedDeal: row.deal === "—" ? "— None —" : row.deal || "— None —",
      notes: row.notes || "—",
    });
    setEditingEmail(row);
    setAddModalOpen(true);
  };

  const toYyyyMmDd = (ddMmYyyy) => {
    if (!ddMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(ddMmYyyy)) return ddMmYyyy || "";
    const [d, m, y] = ddMmYyyy.split("-");
    return `${y}-${m}-${d}`;
  };

  const handleEmailFormChange = (field, value) => {
    setEmailForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEmail = () => {
    const { subject, date, company, rep, linkedDeal, notes } = emailForm;
    if (!subject.trim()) return;
    const repEntry = REPS.find((r) => r.name === rep) || REPS[0];
    const emailDate = toYyyyMmDd(date) || new Date().toISOString().slice(0, 10);
    const deal = linkedDeal === "— None —" ? "—" : linkedDeal;
    const payload = {
      date: emailDate,
      subject: subject.trim(),
      company: company.trim() || "—",
      rep: repEntry.name,
      repInitials: repEntry.initials,
      deal: deal || "—",
      notes: notes.trim() || "—",
    };
    if (editingEmail) {
      setEmails((prev) => prev.map((e) => (e.id === editingEmail.id ? { ...payload, id: e.id } : e)));
      setEditingEmail(null);
      toast.success("Email log updated successfully");
    } else {
      setEmails((prev) => [{ ...payload, id: Math.max(0, ...emails.map((e) => e.id)) + 1 }, ...prev]);
      toast.success("Email log added successfully");
    }
    setEmailForm(initialEmailForm);
    setAddModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setEmailForm(initialEmailForm);
    setEditingEmail(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Mail className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Email Log</h1>
            <p className="text-sm text-body leading-snug">View and log all email activity linked to deals and contacts.</p>
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
            onClick={() => { setEditingEmail(null); setEmailForm(initialEmailForm); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Log Email
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Three summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Total Emails</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">{emails.length}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">This Month</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">{thisMonth}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Linked to Deals</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{linkedToDeals}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Link2 className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Email Sync info banner */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-blue-600" strokeWidth={2} />
          </span>
          <p className="text-sm text-blue-800">
            <strong>Email Sync Enabled:</strong> Emails from connected inbox are automatically logged. You can also manually log emails below.
          </p>
        </div>

        {/* Email Activity Log table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-base font-semibold text-brand-dark">Email Activity Log</h2>
            <input
              type="search"
              placeholder="Search emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[800px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Subject</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Rep</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Deal</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Notes</th>
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
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditEmail(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit email"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete email"
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
            <div className="py-12 text-center text-body text-sm">No emails match your search.</div>
          )}
        </div>
      </div>

      {/* Log Email Activity Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingEmail ? "Edit Email Log" : "Log Email Activity"}</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Email Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Subject *</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => handleEmailFormChange("subject", e.target.value)}
                    placeholder="Email subject"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailForm.date}
                      onChange={(e) => handleEmailFormChange("date", e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                  <input
                    type="text"
                    value={emailForm.company}
                    onChange={(e) => handleEmailFormChange("company", e.target.value)}
                    placeholder="Company name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Rep</label>
                  <select
                    value={emailForm.rep}
                    onChange={(e) => handleEmailFormChange("rep", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {REPS.map((r) => (
                      <option key={r.initials} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked deal</label>
                  <select
                    value={emailForm.linkedDeal}
                    onChange={(e) => handleEmailFormChange("linkedDeal", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {LINKED_DEALS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes</label>
                  <textarea
                    value={emailForm.notes}
                    onChange={(e) => handleEmailFormChange("notes", e.target.value)}
                    placeholder="Email summary / content"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-y min-h-[100px]"
                  />
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
                onClick={handleSaveEmail}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingEmail ? "Save changes" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
