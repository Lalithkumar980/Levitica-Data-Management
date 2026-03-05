import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  Phone,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function mapLeadToRow(lead, ownerList = []) {
  let owner = lead.owner && typeof lead.owner === "object" ? lead.owner : null;
  if (!owner && lead.owner && ownerList.length) {
    const id = typeof lead.owner === "string" ? lead.owner : lead.owner?.toString?.();
    const u = ownerList.find((o) => (o.id || o._id) === id);
    if (u) owner = { _id: u._id || u.id, name: u.name };
  }
  const ownerId = owner ? (owner._id || owner.id) : (lead.owner && typeof lead.owner === "string" ? lead.owner : null);
  const created = lead.createdAt ? new Date(lead.createdAt).toISOString().slice(0, 10) : "—";
  return {
    id: lead._id,
    ownerId: ownerId || null,
    name: [lead.fname, lead.lname].filter(Boolean).join(" ") || "—",
    subtext: lead.notes ? lead.notes.slice(0, 50) : "—",
    company: lead.company || "—",
    phone: lead.phone || "—",
    email: lead.email || "—",
    industry: lead.industry || "—",
    city: lead.city ? (lead.city + (lead.country ? `, ${lead.country}` : "")).trim() : (lead.country || "—"),
    source: lead.source || "—",
    status: lead.status || "New",
    owner: owner ? owner.name : "—",
    ownerInitials: getInitials(owner ? owner.name : ""),
    created,
  };
}

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Other"];
const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "LinkedIn", "Event/Trade Show", "Partner", "Advertisement", "Other"];
const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Disqualified"];
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
  LinkedIn: "bg-blue-100 text-blue-700",
  "Event/Trade Show": "bg-violet-100 text-violet-700",
  Partner: "bg-emerald-100 text-emerald-700",
  Advertisement: "bg-gray-100 text-gray-700",
};

const initialLeadForm = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  email: "",
  industry: "Technology",
  city: "",
  country: "India",
  leadSource: "Website",
  status: "New",
  assignedTo: "",
  notes: "",
};

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

function AddEditLeadModal({ open, onClose, onSave, lead: editingLead, users, currentUserId, isRep }) {
  const [form, setForm] = useState(initialLeadForm);

  useEffect(() => {
    if (!open) return;
    if (editingLead) {
      const parts = (editingLead.name || "").trim().split(/\s+/);
      setForm({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        company: editingLead.company === "—" ? "" : editingLead.company,
        phone: editingLead.phone === "—" ? "" : editingLead.phone,
        email: editingLead.email === "—" ? "" : editingLead.email,
        industry: editingLead.industry === "—" ? "Technology" : editingLead.industry,
        city: (editingLead.city || "").split(",")[0]?.trim() || "",
        country: "India",
        leadSource: editingLead.source === "—" ? "Website" : editingLead.source,
        status: editingLead.status || "New",
        assignedTo: editingLead.ownerId || (users[0] && (users[0]._id || users[0].id)) || currentUserId || "",
        notes: editingLead.subtext === "—" ? "" : editingLead.subtext,
      });
    } else {
      setForm({
        ...initialLeadForm,
        assignedTo: isRep ? (currentUserId || "") : (users[0] && (users[0]._id || users[0].id)) || currentUserId || "",
      });
    }
  }, [open, editingLead, users, currentUserId, isRep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ownerId = isRep ? currentUserId : (form.assignedTo || currentUserId);
    if (!ownerId && !editingLead) return;
    onSave(form, !!editingLead, ownerId);
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
              <label className={labelClass}>First Name *</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select name="industry" value={form.industry} onChange={handleChange} className={inputClass}>
                {INDUSTRIES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Source *</label>
              <select name="leadSource" value={form.leadSource} onChange={handleChange} className={inputClass} required>
                {LEAD_SOURCES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {!isRep && users && users.length > 0 && (
              <div>
                <label className={labelClass}>Assigned To</label>
                <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className={inputClass}>
                  {users.map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>{u.name || u.email}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className={labelClass}>Notes</label>
            <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className={inputClass} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition">Cancel</button>
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

export default function LeadsPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Rep", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Rep", email: "", initials: "—" };
  const currentUserId = storedUser && (storedUser._id || storedUser.id);

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isRep = storedUser && storedUser.role === "Sales Rep";
  const canDelete = storedUser && storedUser.role === "Admin";

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to manage leads.");
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const leadsRes = await apiRequest("/api/v1/leads?page=1&limit=200");
        let userList = [];
        if (!isRep) {
          try {
            const usersRes = await apiRequest("/api/v1/team/users");
            userList = usersRes.users || [];
          } catch (e) {
            if (e?.status === 401) throw e;
          }
        }
        if (cancelled) return;
        setLeads((leadsRes.leads || []).map((l) => mapLeadToRow(l, userList)));
        setUsers(userList);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load leads");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [navigate, isRep]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = leads.filter((row) => {
    const matchSearch =
      !search ||
      (row.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.email || "").toLowerCase().includes(search.toLowerCase());
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

  const handleDelete = async (id) => {
    if (!canDelete) return;
    try {
      await apiRequest(`/api/v1/leads/${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lead deleted");
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to delete lead");
    }
  };

  const handleSaveLead = async (form, isEdit, ownerId) => {
    const payload = {
      fname: form.firstName.trim(),
      lname: form.lastName.trim(),
      company: form.company.trim() || undefined,
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      industry: form.industry || undefined,
      city: form.city.trim() || undefined,
      country: (form.country && form.country.trim()) || "India",
      source: form.leadSource,
      status: form.status || "New",
      notes: form.notes.trim() || undefined,
      owner: ownerId,
    };
    try {
      if (isEdit && editingLead) {
        const res = await apiRequest(`/api/v1/leads/${editingLead.id}`, { method: "PUT", body: payload });
        const updated = mapLeadToRow({ ...res.lead, _id: res.lead._id, owner: res.lead.owner }, users);
        setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? updated : l)));
        toast.success("Lead updated successfully");
      } else {
        const res = await apiRequest("/api/v1/leads", { method: "POST", body: payload });
        const created = mapLeadToRow({ ...res.lead, _id: res.lead._id, owner: res.lead.owner }, users);
        setLeads((prev) => [created, ...prev]);
        toast.success("Lead added successfully");
      }
      setEditingLead(null);
      setShowLeadModal(false);
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to save lead");
    }
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
          />
          <button type="button" className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition" aria-label="Notifications">
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
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{currentUser.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{currentUser.initials}</div>
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
        users={users}
        currentUserId={currentUserId}
        isRep={isRep}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-body">Loading leads…</div>
        ) : (
          <>
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
                    <Phone className="w-6 h-6 text-amber-700" strokeWidth={2} />
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
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8">
                    <option>All Status</option>
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8">
                    <option>All Sources</option>
                    {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
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
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{row.industry}</span>
                        </td>
                        <td className="py-3 px-3 text-black truncate" title={row.city}>{row.city}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLES[row.source] || "bg-gray-100 text-gray-700"}`}>{row.source}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>{row.status}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">{row.ownerInitials}</span>
                            <span className="text-black truncate" title={row.owner}>{row.owner}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-black tabular-nums whitespace-nowrap">{row.created}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => { setEditingLead(row); setShowLeadModal(true); }} className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition" aria-label="Edit lead">
                              <Pencil className="w-4 h-4" strokeWidth={2} />
                            </button>
                            {canDelete && (
                              <button type="button" onClick={() => handleDelete(row.id)} className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition" aria-label="Delete lead">
                                <Trash2 className="w-4 h-4" strokeWidth={2} />
                              </button>
                            )}
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
          </>
        )}
      </div>
    </>
  );
}
