import React, { useState, useEffect, useRef } from "react";
import { Bell, Users, UserCheck, UserPlus, Target, Plus, Pencil, Trash2, X, Save, Calendar, User, LogOut } from "lucide-react";

const SALES_USER = { name: "Vikram Joshi", role: "Sales Rep", email: "vikram.joshi@company.com", initials: "VJ" };

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function AddContactModal({ open, onClose, onSave, contact: editingContact }) {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

  const [form, setForm] = useState({
    fullName: "",
    jobTitle: "",
    phone: "",
    status: "Lead",
    owner: "Arjun Sharma",
    tags: "",
    notes: "",
    company: "",
    email: "",
    city: "",
    source: "",
    lastContactDate: "",
  });

  useEffect(() => {
    if (!open) return;
    if (editingContact) {
      setForm({
        fullName: editingContact.name || "",
        jobTitle: editingContact.title === "-" ? "" : (editingContact.title || ""),
        phone: editingContact.phone === "-" ? "" : (editingContact.phone || ""),
        status: editingContact.status || "Lead",
        owner: editingContact.owner || "Arjun Sharma",
        tags: Array.isArray(editingContact.tags) ? editingContact.tags.join(", ") : "",
        notes: "",
        company: editingContact.company === "-" ? "" : (editingContact.company || ""),
        email: editingContact.email === "-" ? "" : (editingContact.email || ""),
        city: editingContact.city === "-" ? "" : (editingContact.city || ""),
        source: editingContact.source === "-" ? "" : (editingContact.source || ""),
        lastContactDate: editingContact.lastContact === "-" ? "" : (editingContact.lastContact || ""),
      });
    } else {
      setForm({
        fullName: "",
        jobTitle: "",
        phone: "",
        status: "Lead",
        owner: "Arjun Sharma",
        tags: "",
        notes: "",
        company: "",
        email: "",
        city: "",
        source: "",
        lastContactDate: "",
      });
    }
  }, [open, editingContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName?.trim()) return;
    const tagList = form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const newContact = {
      id: editingContact?.id ?? Date.now(),
      name: form.fullName.trim(),
      initials: getInitials(form.fullName),
      company: form.company?.trim() || "-",
      title: form.jobTitle?.trim() || "-",
      email: form.email?.trim() || "-",
      phone: form.phone?.trim() || "-",
      city: form.city?.trim() || "-",
      status: form.status,
      source: form.source || "-",
      owner: form.owner,
      ownerInitials: getInitials(form.owner),
      lastContact: form.lastContactDate || "-",
      tags: tagList.length ? tagList : [],
    };
    onSave(newContact, !!editingContact);
    setForm({
      fullName: "",
      jobTitle: "",
      phone: "",
      status: "Lead",
      owner: "Arjun Sharma",
      tags: "",
      notes: "",
      company: "",
      email: "",
      city: "",
      source: "",
      lastContactDate: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingContact ? "Edit Contact" : "New Contact"}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Contact name" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Job Title</label>
                <input type="text" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="CEO, CTO..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91xxxxxxxxx" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option>Lead</option>
                  <option>Prospect</option>
                  <option>Customer</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Owner</label>
                <select name="owner" value={form.owner} onChange={handleChange} className={inputClass}>
                  <option>Arjun Sharma</option>
                  <option>Vikram Joshi</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tags (comma separated)</label>
                <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="enterprise, tech" className={inputClass} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company</label>
                <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@company.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Source</label>
                <select name="source" value={form.source} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option>Referral</option>
                  <option>Cold Call</option>
                  <option>Website</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Last Contact Date</label>
                <div className="relative">
                  <input type="text" name="lastContactDate" value={form.lastContactDate} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass + " pr-10"} />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className={labelClass}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={5} placeholder="Additional notes" className={inputClass + " w-full min-h-[120px] resize-y"} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
              <Save className="w-4 h-4" strokeWidth={2} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  Customer: "bg-success/15 text-success",
  Prospect: "bg-blue-100 text-blue-700",
  Lead: "bg-warning/15 text-warning",
};

const SOURCE_STYLES = {
  Referral: "bg-success/15 text-success",
  "Cold Call": "bg-warning/15 text-warning",
  Website: "bg-blue-100 text-blue-700",
};

const INITIAL_CONTACTS = [
  {
    id: 1,
    name: "Suresh Rajan",
    initials: "SR",
    company: "TechNova Pvt Ltd",
    title: "CTO",
    email: "suresh@technova.com",
    phone: "9876543210",
    city: "Bangalore",
    status: "Customer",
    source: "Referral",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    lastContact: "2025-01-15",
    tags: ["enterprise", "tech"],
  },
  {
    id: 2,
    name: "Dev Malhotra",
    initials: "DM",
    company: "Horizon Retail Co",
    title: "VP Operations",
    email: "dev@horizon.co",
    phone: "9988776655",
    city: "Delhi",
    status: "Prospect",
    source: "Cold Call",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    lastContact: "2025-02-22",
    tags: ["enterprise", "retail"],
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleSaveContact = (c, isEdit) => {
    if (isEdit) {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? c : x)));
    } else {
      setContacts((prev) => [c, ...prev]);
    }
    setEditingContact(null);
    setShowAddContactModal(false);
  };

  const handleDeleteContact = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const filtered = contacts.filter((row) => {
    const matchSearch =
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Users className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Contacts</h1>
            <p className="text-[13px] text-black/70">Manage CRM contacts and relationships.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            onClick={() => { setEditingContact(null); setShowAddContactModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Contact
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

      <AddContactModal
        open={showAddContactModal}
        onClose={() => { setShowAddContactModal(false); setEditingContact(null); }}
        onSave={handleSaveContact}
        contact={editingContact}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Four summary cards - same style as Finance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Contacts</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">2</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Customers</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">1</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Prospects</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">1</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Leads</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">0</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserPlus className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Contacts table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Users className="w-5 h-5 text-brand" strokeWidth={2} />
              Contacts
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search name, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Status</option>
                <option>Customer</option>
                <option>Prospect</option>
                <option>Lead</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1000px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Title</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Email</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Phone</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">City</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Source</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Owner</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Last Contact</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Tags</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                    <td className="py-3 px-3 text-right text-black tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand font-semibold text-xs shrink-0">
                          {row.initials}
                        </span>
                        <span className="font-medium text-brand-dark">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.title}>{row.title}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.email}>{row.email}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.phone}>{row.phone}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.city}>{row.city}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLES[row.source] || "bg-gray-100 text-gray-700"}`}>
                        {row.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                          {row.ownerInitials}
                        </span>
                        <span className="text-body truncate" title={row.owner}>{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-black tabular-nums whitespace-nowrap">{row.lastContact}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {(row.tags?.length ? row.tags : ["-"]).map((tag) => (
                          <span key={tag} className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingContact(row); setShowAddContactModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit contact"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete contact"
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
            <div className="py-12 text-center text-body text-sm">No contacts match your filters.</div>
          )}
        </div>
      </div>
    </>
  );
}
