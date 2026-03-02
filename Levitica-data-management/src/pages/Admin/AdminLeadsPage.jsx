import React, { useState } from "react";
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
} from "lucide-react";

const INDUSTRIES = ["Technology", "Consulting", "Retail", "Healthcare", "Education", "Finance", "Manufacturing", "Other"];
const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "LinkedIn", "Event/Trade Show", "Partner", "Advertisement"];
const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Disqualified"];
const ASSIGNED_USERS = [
  { name: "Priya Nair", initials: "PN" },
  { name: "Arjun Kapoor", initials: "AR" },
  { name: "Vikram Joshi", initials: "VJ" },
  { name: "Meena Reddy", initials: "MR" },
  { name: "Aditya Kumar", initials: "AK" },
  { name: "Kavya Shah", initials: "KS" },
];

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

const INITIAL_LEADS = [
  { id: 1, name: "Rohan Mehta", subtext: "Marat Tech Summit", company: "TechNova Pvt Ltd", phone: "9876543213", email: "rohan@technova.com", industry: "Technology", city: "Bangalore, India", source: "Referral", status: "New", owner: "Vikram Joshi", ownerInitials: "VJ", created: "2025-01-10" },
  { id: 2, name: "Sanya Kapoor", subtext: "Filled contact form", company: "GreenPath Solutions", phone: "9123456783", email: "sanya@greenpath.in", industry: "Consulting", city: "Mumbai, India", source: "Website", status: "Contacted", owner: "Vikram Joshi", ownerInitials: "VJ", created: "2025-01-14" },
  { id: 3, name: "Deepak Rao", subtext: "Budget confirmac", company: "Horizon Retail Co", phone: "9988776655", email: "deepak@horizon.co", industry: "Retail", city: "Delhi, India", source: "Cold Call", status: "Qualified", owner: "Meena Reddy", ownerInitials: "MR", created: "2025-01-18" },
  { id: 4, name: "Anjali Tiwari", subtext: "Connected on LinkedIn", company: "CloudSoft India", phone: "9011223344", email: "anjali@cloudsoft.io", industry: "Technology", city: "Hyderabad, India", source: "LinkedIn", status: "New", owner: "Meena Reddy", ownerInitials: "MR", created: "2025-01-20" },
  { id: 5, name: "Sunil Naik", subtext: "Ready to convert to deal", company: "MediCore India", phone: "583881734", email: "sunil@medicore.in", industry: "Healthcare", city: "Ahmedabad, India", source: "Event/Trade Show", status: "Converted", owner: "Aditya Kumar", ownerInitials: "AK", created: "2025-01-22" },
  { id: 6, name: "Pooja Menon", subtext: "NGO - special pricing needed", company: "EduLeap Foundation", phone: "9658098765", email: "pooja@eduleap.org", industry: "Education", city: "Pune, India", source: "Partner", status: "New", owner: "Aditya Kumar", ownerInitials: "AK", created: "2025-02-05" },
  { id: 7, name: "Ravi Shah", subtext: "Interested in Enterprise plan", company: "FinPlex Systems", phone: "9955884403", email: "ravi@finplex.com", industry: "Finance", city: "Chennai, India", source: "Cold Call", status: "Contacted", owner: "Kavya Shah", ownerInitials: "KS", created: "2025-02-08" },
  { id: 8, name: "Nisha Jain", subtext: "Budget too low", company: "AutoParts Hub", phone: "9738123456", email: "nisha@autoparts.co", industry: "Manufacturing", city: "Surat, India", source: "Advertisement", status: "Disqualified", owner: "Kavya Shah", ownerInitials: "KS", created: "2025-02-10" },
];

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
  assignedTo: "Priya Nair",
  notes: "",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);

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
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lead deleted");
  };

  const openEditLead = (row) => {
    const parts = (row.name || "").trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    setLeadForm({
      firstName,
      lastName,
      company: row.company || "",
      phone: row.phone || "",
      email: row.email || "",
      industry: row.industry || "Technology",
      city: (row.city || "").split(",")[0]?.trim() || "",
      country: "India",
      leadSource: row.source || "Website",
      status: row.status || "New",
      assignedTo: row.owner || ASSIGNED_USERS[0]?.name || "",
      notes: row.subtext || "",
    });
    setEditingLead(row);
    setAddModalOpen(true);
  };

  const openViewLead = (row) => setViewingLead(row);

  const handleLeadFormChange = (field, value) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = () => {
    const { firstName, lastName, company, phone, email, industry, city, country, leadSource, status, assignedTo, notes } = leadForm;
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !leadSource) return;
    const ownerEntry = ASSIGNED_USERS.find((u) => u.name === assignedTo) || ASSIGNED_USERS[0];
    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      subtext: notes.trim().slice(0, 50) || "—",
      company: company.trim() || "—",
      phone: phone.trim(),
      email: email.trim() || "—",
      industry: industry,
      city: city.trim() ? `${city.trim()}, ${country.trim() || "India"}` : `${country.trim() || "India"}`,
      source: leadSource,
      status,
      owner: ownerEntry.name,
      ownerInitials: ownerEntry.initials,
      created: editingLead ? editingLead.created : new Date().toISOString().slice(0, 10),
    };
    if (editingLead) {
      setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? { ...l, ...payload, id: l.id } : l)));
      setEditingLead(null);
      toast.success("Lead updated successfully");
    } else {
      setLeads((prev) => [{ ...payload, id: Math.max(0, ...leads.map((l) => l.id)) + 1 }, ...prev]);
      toast.success("Lead added successfully");
    }
    setLeadForm(initialLeadForm);
    setAddModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setLeadForm(initialLeadForm);
    setEditingLead(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <UserPlus className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Leads</h1>
            <p className="text-sm text-body leading-snug">Manage and qualify leads from first contact to conversion.</p>
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
            onClick={() => { setEditingLead(null); setLeadForm(initialLeadForm); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Lead
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Six summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Total</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1.5">Leads</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">New</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">{stats.new}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserPlus className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Contacted</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">{stats.contacted}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider mb-1.5">Qualified</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">{stats.qualified}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Converted</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">{stats.converted}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">Disqualified</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">{stats.disqualified}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserX className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Lead Database */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-brand-dark mb-4">Lead Database</h2>
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

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1100px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Industry</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">City</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Source</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Owner</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Created</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium text-brand-dark">{row.name}</p>
                        <p className="text-xs text-body">{row.subtext}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.phone}>{row.phone}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.email}>{row.email}</td>
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
                        <span className="text-body truncate" title={row.owner}>{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body tabular-nums whitespace-nowrap">{row.created}</td>
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
                    {ASSIGNED_USERS.map((u) => (
                      <option key={u.initials} value={u.name}>{u.name}</option>
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
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
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
