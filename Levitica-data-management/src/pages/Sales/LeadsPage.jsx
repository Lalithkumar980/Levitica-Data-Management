import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  Award,
  Check,
  X,
  Target,
  Save,
  User,
  LogOut,
} from "lucide-react";
import { getStoredUser, clearAuth } from "../../utils/api";

const SALES_USER = { name: "Vikram Joshi", role: "Sales Rep", email: "vikram.joshi@company.com", initials: "VJ" };

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

function AddEditLeadModal({ open, onClose, onSave, lead: editingLead }) {
  const [form, setForm] = useState({
    name: "",
    subtext: "",
    company: "",
    phone: "",
    email: "",
    industry: "Technology",
    city: "",
    source: "Referral",
    status: "New",
    owner: "Vikram Joshi",
  });

  useEffect(() => {
    if (!open) return;
    if (editingLead) {
      setForm({
        name: editingLead.name || "",
        subtext: editingLead.subtext || "",
        company: editingLead.company || "",
        phone: editingLead.phone || "",
        email: editingLead.email || "",
        industry: editingLead.industry || "Technology",
        city: editingLead.city || "",
        source: editingLead.source || "Referral",
        status: editingLead.status || "New",
        owner: editingLead.owner || "Vikram Joshi",
      });
    } else {
      setForm({
        name: "",
        subtext: "",
        company: "",
        phone: "",
        email: "",
        industry: "Technology",
        city: "",
        source: "Referral",
        status: "New",
        owner: "Vikram Joshi",
      });
    }
  }, [open, editingLead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getInitials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) return;
    const payload = {
      id: editingLead?.id ?? Date.now(),
      name: form.name.trim(),
      subtext: form.subtext?.trim() || "",
      company: form.company?.trim() || "",
      phone: form.phone?.trim() || "",
      email: form.email?.trim() || "",
      industry: form.industry || "Technology",
      city: form.city?.trim() || "",
      source: form.source || "Referral",
      status: form.status || "New",
      owner: form.owner?.trim() || "Vikram Joshi",
      ownerInitials: getInitials(form.owner || "VJ"),
      created: editingLead?.created || new Date().toISOString().slice(0, 10),
    };
    onSave(payload, !!editingLead);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingLead ? "Edit Lead" : "Add Lead"}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Lead name" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Subtext / Notes</label>
              <input type="text" name="subtext" value={form.subtext} onChange={handleChange} placeholder="e.g. Met at event" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select name="industry" value={form.industry} onChange={handleChange} className={inputClass}>
                <option>Technology</option>
                <option>Consulting</option>
                <option>Retail</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <select name="source" value={form.source} onChange={handleChange} className={inputClass}>
                <option>Referral</option>
                <option>Website</option>
                <option>Cold Call</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Converted</option>
                <option>Disqualified</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Owner</label>
              <input type="text" name="owner" value={form.owner} onChange={handleChange} placeholder="Owner" className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
              <Save className="w-4 h-4" strokeWidth={2} />
              {editingLead ? "Save changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Qualified: "bg-emerald-100 text-emerald-700",
  Converted: "bg-success/15 text-success",
  Disqualified: "bg-danger/15 text-danger",
};

const SOURCE_STYLES = {
  Referral: "bg-success/15 text-success",
  Website: "bg-blue-100 text-blue-700",
  "Cold Call": "bg-amber-100 text-amber-700",
};

const INITIAL_LEADS = [
  {
    id: 1,
    name: "Rohan Mehta",
    subtext: "Met at Tech Summit",
    company: "TechNova Pvt ltd",
    phone: "9876543213",
    email: "rohan@technova.com",
    industry: "Technology",
    city: "Bangalore, India",
    source: "Referral",
    status: "New",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    created: "2025-01-13",
  },
  {
    id: 2,
    name: "Sanya Kapoor",
    subtext: "Filled contact form",
    company: "GreenPath Solutions",
    phone: "9123456783",
    email: "sanya@greenpath.in",
    industry: "Consulting",
    city: "Mumbai, India",
    source: "Website",
    status: "Contacted",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    created: "2025-01-14",
  },
];

export default function LeadsPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser() || SALES_USER;
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const filtered = leads.filter((row) => {
    const matchSearch =
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || row.status === statusFilter;
    const matchSource = sourceFilter === "All Sources" || row.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
    converted: leads.filter((l) => l.status === "Converted").length,
    disqualified: leads.filter((l) => l.status === "Disqualified").length,
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleSaveLead = (payload, isEdit) => {
    if (isEdit) {
      setLeads((prev) => prev.map((l) => (l.id === payload.id ? { ...payload, ownerInitials: payload.owner?.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "VJ" } : l)));
    } else {
      setLeads((prev) => [{ ...payload, ownerInitials: payload.owner?.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "VJ" }, ...prev]);
    }
    setEditingLead(null);
    setShowLeadModal(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Target className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Leads</h1>
            <p className="text-[13px] text-black/70">Manage and qualify leads through your sales funnel.</p>
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
            onClick={() => { setEditingLead(null); setShowLeadModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Lead
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{currentUser.initials || "—"}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{currentUser.initials || "—"}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{currentUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{currentUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left"><User className="w-4 h-4 text-gray-500" strokeWidth={2} /> My Profile</button>
                  <button type="button" onClick={() => { clearAuth(); navigate("/login"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"><LogOut className="w-4 h-4" strokeWidth={2} /> Log out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <AddEditLeadModal
        open={showLeadModal}
        onClose={() => { setShowLeadModal(false); setEditingLead(null); }}
        onSave={handleSaveLead}
        lead={editingLead}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Six stat cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{stats.total}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Leads</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">New</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{stats.new}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserPlus className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Contacted</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{stats.contacted}</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Qualified</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{stats.qualified}</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 text-emerald-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Converted</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{stats.converted}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Check className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Disqualified</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{stats.disqualified}</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <X className="w-6 h-6 text-red-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Lead Database */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Target className="w-5 h-5 text-brand" strokeWidth={2} />
              Lead Database
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search leads..."
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
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Converted</option>
                <option>Disqualified</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Sources</option>
                <option>Referral</option>
                <option>Website</option>
                <option>Cold Call</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1100px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Phone</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Email</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Industry</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">City</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Source</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Owner</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Created</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                    <td className="py-3 px-3 text-black tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium text-brand-dark">{row.name}</p>
                        <p className="text-xs text-black">{row.subtext}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.phone}>{row.phone}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.email}>{row.email}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {row.industry}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.city}>{row.city}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLES[row.source] || "bg-gray-100 text-gray-700"}`}>
                        {row.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.ownerInitials}
                        </span>
                        <span className="text-black truncate" title={row.owner}>{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black tabular-nums whitespace-nowrap">{row.created}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingLead(row); setShowLeadModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit lead"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete lead"
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
            <div className="py-12 text-center text-body text-sm">No leads match your filters.</div>
          )}
        </div>
      </div>
    </>
  );
}
