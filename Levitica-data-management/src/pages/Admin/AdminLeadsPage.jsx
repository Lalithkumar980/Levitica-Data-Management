import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Download,
  X,
  Save,
  Users,
  UserPlus,
  Phone,
  CheckCircle,
  Trophy,
  UserX,
  User,
  LogOut,
  Target,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/** Map backend lead to table row shape. ownerList used when lead.owner is just an id. */
function mapLeadToRow(lead, ownerList = []) {
  let owner = lead.owner && typeof lead.owner === "object" ? lead.owner : null;
  if (!owner && lead.owner && ownerList.length) {
    const id = typeof lead.owner === "string" ? lead.owner : lead.owner?.toString?.();
    owner = ownerList.find((u) => (u.id || u._id) === id) ? { _id: id, name: ownerList.find((u) => (u.id || u._id) === id).name } : null;
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

const INDUSTRIES = ["Technology", "Consulting", "Retail", "Healthcare", "Education", "Finance", "Manufacturing", "Other"];
const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "LinkedIn", "Event/Trade Show", "Partner", "Advertisement"];
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

export default function AdminLeadsPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const adminUser = storedUser ? { name: storedUser.name || "Admin", role: storedUser.role || "Admin", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "Admin", role: "Admin", email: "", initials: "AD" };

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Redirect to login if not authenticated
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
        const [leadsRes, usersRes] = await Promise.all([
          apiRequest("/api/v1/leads?page=1&limit=200"),
          apiRequest("/api/v1/admin/users").catch((e) => {
            if (e?.status === 401) throw e;
            return { users: [] };
          }),
        ]);
        if (cancelled) return;
        setLeads((leadsRes.leads || []).map((l) => mapLeadToRow(l)));
        setUsers(usersRes.users || []);
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
  }, [navigate]);

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

  const handleDelete = async (id) => {
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

  const openEditLead = (row) => {
    const parts = (row.name || "").trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    setLeadForm({
      firstName,
      lastName,
      company: row.company === "—" ? "" : row.company,
      phone: row.phone === "—" ? "" : row.phone,
      email: row.email === "—" ? "" : row.email,
      industry: row.industry === "—" ? "Technology" : row.industry,
      city: (row.city || "").split(",")[0]?.trim() || "",
      country: "India",
      leadSource: row.source === "—" ? "Website" : row.source,
      status: row.status || "New",
      assignedTo: row.ownerId || (users[0] && users[0].id) || "",
      notes: row.subtext === "—" ? "" : row.subtext,
    });
    setEditingLead(row);
    setAddModalOpen(true);
  };

  const openViewLead = (row) => setViewingLead(row);

  const handleLeadFormChange = (field, value) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = async () => {
    const { firstName, lastName, company, phone, email, industry, city, country, leadSource, status, assignedTo, notes } = leadForm;
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !leadSource) {
      toast.error("First name, last name, phone and lead source are required");
      return;
    }
    const ownerId = assignedTo || (users[0] && users[0].id);
    if (!ownerId && !editingLead) {
      toast.error("Please assign an owner (ensure users are loaded).");
      return;
    }
    const payload = {
      fname: firstName.trim(),
      lname: lastName.trim(),
      company: company.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      industry: industry || undefined,
      city: city.trim() || undefined,
      country: (country && country.trim()) || "India",
      source: leadSource,
      status: status || "New",
      notes: notes.trim() || undefined,
      owner: ownerId,
    };
    try {
      if (editingLead) {
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
      setLeadForm(initialLeadForm);
      setEditingLead(null);
      setAddModalOpen(false);
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

  const closeAddModal = () => {
    setAddModalOpen(false);
    setLeadForm(initialLeadForm);
    setEditingLead(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <UserPlus className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Leads</h1>
            <p className="text-[13px] text-black/70">Manage and qualify leads from first contact to conversion.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input
            type="search"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            onClick={() => { setEditingLead(null); setLeadForm({ ...initialLeadForm, assignedTo: (users[0] && users[0].id) || "" }); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Lead
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{adminUser.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{adminUser.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{adminUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{adminUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{adminUser.email}</p>
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

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Six stat cards - same style as HR */}
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
                <CheckCircle className="w-6 h-6 text-emerald-700" strokeWidth={2} />
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
                <Trophy className="w-6 h-6 text-teal-700" strokeWidth={2} />
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
                <UserX className="w-6 h-6 text-red-700" strokeWidth={2} />
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
                <option>LinkedIn</option>
                <option>Event/Trade Show</option>
                <option>Partner</option>
                <option>Advertisement</option>
              </select>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-body text-sm">Loading leads…</div>
          ) : (
          <React.Fragment>
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
                    <td className="py-3 px-3 text-body truncate" title={row.city}>{row.city}</td>
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
                          onClick={() => openEditLead(row)}
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
                        <button
                          type="button"
                          onClick={() => openViewLead(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="View lead"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
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
          </React.Fragment>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingLead ? "Edit Lead" : "Add Lead"}</h2>
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
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Lead Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">First name *</label>
                  <input
                    type="text"
                    value={leadForm.firstName}
                    onChange={(e) => handleLeadFormChange("firstName", e.target.value)}
                    placeholder="First name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Last name *</label>
                  <input
                    type="text"
                    value={leadForm.lastName}
                    onChange={(e) => handleLeadFormChange("lastName", e.target.value)}
                    placeholder="Last name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                  <input
                    type="text"
                    value={leadForm.company}
                    onChange={(e) => handleLeadFormChange("company", e.target.value)}
                    placeholder="Company name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Phone *</label>
                  <input
                    type="text"
                    value={leadForm.phone}
                    onChange={(e) => handleLeadFormChange("phone", e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => handleLeadFormChange("email", e.target.value)}
                    placeholder="email@company.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Industry</label>
                  <select
                    value={leadForm.industry}
                    onChange={(e) => handleLeadFormChange("industry", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {INDUSTRIES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    value={leadForm.city}
                    onChange={(e) => handleLeadFormChange("city", e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Country</label>
                  <input
                    type="text"
                    value={leadForm.country}
                    onChange={(e) => handleLeadFormChange("country", e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Lead source *</label>
                  <select
                    value={leadForm.leadSource}
                    onChange={(e) => handleLeadFormChange("leadSource", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {LEAD_SOURCES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => handleLeadFormChange("status", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Assigned to</label>
                  <select
                    value={leadForm.assignedTo}
                    onChange={(e) => handleLeadFormChange("assignedTo", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {users.length === 0 && <option value="">No users loaded</option>}
                    {users.map((u) => (
                      <option key={u.id || u._id} value={u.id || u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes</label>
                  <textarea
                    value={leadForm.notes}
                    onChange={(e) => handleLeadFormChange("notes", e.target.value)}
                    placeholder="Notes"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-y min-h-[80px]"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLead}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingLead ? "Save changes" : "Save Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingLead(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">View Lead</h2>
              <button type="button" onClick={() => setViewingLead(null)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Name</span><p className="font-medium text-brand-dark mt-0.5">{viewingLead.name}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Company</span><p className="text-body mt-0.5">{viewingLead.company}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Phone</span><p className="text-body mt-0.5">{viewingLead.phone}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Email</span><p className="text-body mt-0.5">{viewingLead.email}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Industry</span><p className="text-body mt-0.5">{viewingLead.industry}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">City</span><p className="text-body mt-0.5">{viewingLead.city}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Source</span><p className="text-body mt-0.5">{viewingLead.source}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Status</span><p className="text-body mt-0.5">{viewingLead.status}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Owner</span><p className="text-body mt-0.5">{viewingLead.owner}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Created</span><p className="text-body mt-0.5">{viewingLead.created}</p></div>
              {viewingLead.subtext && viewingLead.subtext !== "—" && <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Notes</span><p className="text-body mt-0.5">{viewingLead.subtext}</p></div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
