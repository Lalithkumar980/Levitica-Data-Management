import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, Plus, Pencil, Trash2, X, Save, Calendar, User, LogOut } from "lucide-react";

const SALES_USER = { name: "Vikram Joshi", role: "Sales Rep", email: "vikram.joshi@company.com", initials: "VJ" };

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

function LogEmailModal({ open, onClose, onSave, email: editingEmail }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    subject: "",
    company: "",
    rep: "Vikram Joshi",
    deal: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    if (editingEmail) {
      setForm({
        date: editingEmail.date || new Date().toISOString().slice(0, 10),
        subject: editingEmail.subject || "",
        company: editingEmail.company === "-" ? "" : (editingEmail.company || ""),
        rep: editingEmail.rep || "Vikram Joshi",
        deal: editingEmail.deal === "-" ? "" : (editingEmail.deal || ""),
        notes: editingEmail.notes || "",
      });
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        subject: "",
        company: "",
        rep: "Vikram Joshi",
        deal: "",
        notes: "",
      });
    }
  }, [open, editingEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject?.trim() || !form.date) return;
    const newEmail = {
      id: editingEmail?.id ?? Date.now(),
      date: form.date,
      subject: form.subject.trim(),
      company: form.company?.trim() || "-",
      rep: form.rep,
      repInitials: getInitials(form.rep),
      deal: form.deal || "-",
      notes: form.notes?.trim() || "",
    };
    onSave(newEmail, !!editingEmail);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      subject: "",
      company: "",
      rep: "Vikram Joshi",
      deal: "",
      notes: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingEmail ? "Edit Email" : "Log Email"}</h2>
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
          <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4">Email Details</p>

          <div className="mb-4">
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

          <div className="mb-4">
            <label className={labelClass}>Subject *</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Email subject line"
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
              <label className={labelClass}>Rep</label>
              <select name="rep" value={form.rep} onChange={handleChange} className={inputClass}>
                <option>Vikram Joshi</option>
                <option>Arjun Sharma</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Linked Deal</label>
            <select name="deal" value={form.deal} onChange={handleChange} className={inputClass}>
              <option value="">— None —</option>
              <option>Horizon Retail Integration</option>
              <option>TechNova Enterprise License</option>
            </select>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Email notes..."
              className={inputClass + " min-h-[100px] resize-y"}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const INITIAL_EMAILS = [
  {
    id: 1,
    date: "2025-01-16",
    subject: "Proposal Follow-up Email",
    company: "TechNova Pvt Ltd",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    deal: "TechNova Enterprise License",
    notes: "Sent detailed pricing sheet and...",
  },
];

export default function EmailLogPage() {
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [search, setSearch] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleSaveEmail = (e, isEdit) => {
    if (isEdit) {
      setEmails((prev) => prev.map((x) => (x.id === e.id ? e : x)));
    } else {
      setEmails((prev) => [e, ...prev]);
    }
    setEditingEmail(null);
    setShowLogModal(false);
  };

  const handleDeleteEmail = (id) => {
    if (window.confirm("Are you sure you want to delete this email?")) {
      setEmails((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const filtered = emails.filter(
    (row) =>
      !search ||
      row.subject?.toLowerCase().includes(search.toLowerCase()) ||
      row.company?.toLowerCase().includes(search.toLowerCase()) ||
      row.deal?.toLowerCase().includes(search.toLowerCase())
  );

  const totalEmails = emails.length;
  const thisMonth = emails.filter((e) => {
    const emailDate = new Date(e.date);
    const now = new Date();
    return emailDate.getMonth() === now.getMonth() && emailDate.getFullYear() === now.getFullYear();
  }).length;
  const linkedToDeals = emails.filter((e) => e.deal && e.deal !== "-").length;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Mail className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Email Log</h1>
            <p className="text-[13px] text-black/70">Email activity and sent correspondence.</p>
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
            onClick={() => { setEditingEmail(null); setShowLogModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Log Email
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{SALES_USER.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{SALES_USER.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{SALES_USER.name}</p>
                      <p className="text-xs font-medium text-black/70">{SALES_USER.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{SALES_USER.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left"><User className="w-4 h-4 text-gray-500" strokeWidth={2} /> My Profile</button>
                  <button type="button" onClick={() => (window.location.href = "/")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"><LogOut className="w-4 h-4" strokeWidth={2} /> Log out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <LogEmailModal
        open={showLogModal}
        onClose={() => { setShowLogModal(false); setEditingEmail(null); }}
        onSave={handleSaveEmail}
        email={editingEmail}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Emails</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{totalEmails}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Total</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">This Month</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{thisMonth}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Linked to Deals</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{linkedToDeals}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Deals</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Email sync banner */}
        <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-sm">
          <Mail className="w-5 h-5 shrink-0 text-brand" strokeWidth={2} />
          <p>
            Email Sync Enabled: Emails from connected inbox are automatically logged. You can also manually log emails
            below.
          </p>
        </div>

        {/* Email Activity Log table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand" strokeWidth={2} />
              Email Activity Log
            </h2>
            <input
              type="search"
              placeholder="Search emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-28" />
                <col className="w-[12rem]" />
                <col className="w-[10rem]" />
                <col className="w-36" />
                <col className="w-[10rem]" />
                <col className="w-48" />
                <col className="w-16" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Date</th>
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
                    <td className="py-3 px-3 text-right text-body tabular-nums align-top">{idx + 1}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap align-top">{row.date}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark align-top min-w-0">
                      <span className="block truncate" title={row.subject}>{row.subject}</span>
                    </td>
                    <td className="py-3 px-3 text-body align-top min-w-0">
                      <span className="block truncate" title={row.company}>{row.company}</span>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                          {row.repInitials}
                        </span>
                        <span className="text-body truncate min-w-0" title={row.rep}>{row.rep}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body align-top min-w-0">
                      <span className="block truncate" title={row.deal}>{row.deal}</span>
                    </td>
                    <td className="py-3 px-3 text-body align-top min-w-0">
                      <span className="block truncate" title={row.notes}>{row.notes}</span>
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingEmail(row); setShowLogModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit email"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEmail(row.id)}
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
    </>
  );
}
