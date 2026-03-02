import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Save,
  Calendar,
  Users,
  UserCheck,
  UserPlus,
  Target,
} from "lucide-react";

const STATUS_OPTIONS = ["Lead", "Prospect", "Customer"];
const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "LinkedIn", "Event/Trade Show"];
const OWNERS = [
  { name: "Priya Nair", initials: "PN" },
  { name: "Vikram Joshi", initials: "VJ" },
  { name: "Meena Reddy", initials: "MR" },
  { name: "Aditya Kumar", initials: "AK" },
  { name: "Kavya Shah", initials: "KS" },
];

const STATUS_STYLES = {
  Customer: "bg-emerald-100 text-emerald-700",
  Prospect: "bg-amber-100 text-amber-700",
  Lead: "bg-blue-100 text-blue-700",
};

const SOURCE_STYLES = {
  Referral: "bg-success/15 text-success",
  Website: "bg-blue-100 text-blue-700",
  "Cold Call": "bg-amber-100 text-amber-700",
  "Event/Trade Show": "bg-violet-100 text-violet-700",
  LinkedIn: "bg-blue-100 text-blue-700",
};

const INITIAL_CONTACTS = [
  { id: 1, name: "Suresh Rajan", initials: "SR", company: "TechNova Pvt Ltd", title: "CTO", phone: "9876543210", email: "suresh@technova.com", city: "Bangalore", status: "Customer", source: "Referral", owner: "Vikram Joshi", ownerInitials: "VJ", lastContact: "2025-01-15" },
  { id: 2, name: "Meena Joshi", initials: "MJ", company: "GreenPath Solutions", title: "CEO", phone: "9123456789", email: "meena@greenpath.in", city: "Mumbai", status: "Customer", source: "Website", owner: "Vikram Joshi", ownerInitials: "VJ", lastContact: "2025-01-18" },
  { id: 3, name: "Deepak Verma", initials: "DV", company: "Horizon Retail Co", title: "VP Operations", phone: "9988776655", email: "deepak@horizon.co", city: "Delhi", status: "Prospect", source: "Cold Call", owner: "Meena Reddy", ownerInitials: "MR", lastContact: "2025-02-01" },
  { id: 4, name: "Priya Nair", initials: "PN", company: "CloudSoft India", title: "Director", phone: "9011223344", email: "priya@cloudsoft.io", city: "Hyderabad", status: "Prospect", source: "Event/Trade Show", owner: "Meena Reddy", ownerInitials: "MR", lastContact: "2025-02-05" },
  { id: 5, name: "Arun Krishnan", initials: "AK", company: "MediCore India", title: "CFO", phone: "9654321870", email: "arun@medicore.in", city: "Ahmedabad", status: "Lead", source: "LinkedIn", owner: "Aditya Kumar", ownerInitials: "AK", lastContact: "2025-02-10" },
];

const initialContactForm = {
  firstName: "",
  lastName: "",
  company: "",
  jobTitle: "",
  phone: "",
  email: "",
  city: "",
  country: "India",
  status: "Lead",
  leadSource: "Website",
  owner: "Priya Nair",
  lastContactDate: "",
  tags: "",
  notes: "",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);

  const filtered = contacts.filter((row) => {
    const matchSearch =
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: contacts.length,
    customers: contacts.filter((c) => c.status === "Customer").length,
    prospects: contacts.filter((c) => c.status === "Prospect").length,
    leads: contacts.filter((c) => c.status === "Lead").length,
  };

  const handleDelete = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success("Contact deleted");
  };

  const openEditContact = (row) => {
    const parts = (row.name || "").trim().split(/\s+/);
    setContactForm({
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      company: row.company || "",
      jobTitle: row.title || "",
      phone: row.phone || "",
      email: row.email || "",
      city: row.city || "",
      country: "India",
      status: row.status || "Lead",
      leadSource: row.source || "Website",
      owner: row.owner || OWNERS[0]?.name || "",
      lastContactDate: row.lastContact ? row.lastContact.split("-").reverse().join("-") : "",
      tags: "",
      notes: "",
    });
    setEditingContact(row);
    setAddModalOpen(true);
  };

  const openViewContact = (row) => setViewingContact(row);

  const handleContactFormChange = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (first, last) => {
    const a = (first || "").trim().slice(0, 1).toUpperCase();
    const b = (last || "").trim().slice(0, 1).toUpperCase();
    return (a + b) || "—";
  };

  const handleSaveContact = () => {
    const { firstName, lastName, company, jobTitle, phone, email, city, status, leadSource, owner, lastContactDate } = contactForm;
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return;
    const ownerEntry = OWNERS.find((o) => o.name === owner) || OWNERS[0];
    const name = `${firstName.trim()} ${lastName.trim()}`;
    let lastContact = lastContactDate;
    if (lastContact && /^\d{2}-\d{2}-\d{4}$/.test(lastContact)) {
      const [d, m, y] = lastContact.split("-");
      lastContact = `${y}-${m}-${d}`;
    }
    if (!lastContact) lastContact = new Date().toISOString().slice(0, 10);
    const payload = {
      name,
      initials: getInitials(firstName, lastName),
      company: company.trim() || "—",
      title: jobTitle.trim() || "—",
      phone: phone.trim(),
      email: email.trim() || "—",
      city: city.trim() || "—",
      status,
      source: leadSource,
      owner: ownerEntry.name,
      ownerInitials: ownerEntry.initials,
      lastContact,
    };
    if (editingContact) {
      setContacts((prev) => prev.map((c) => (c.id === editingContact.id ? { ...payload, id: c.id } : c)));
      setEditingContact(null);
      toast.success("Contact updated successfully");
    } else {
      setContacts((prev) => [{ ...payload, id: Math.max(0, ...contacts.map((c) => c.id)) + 1 }, ...prev]);
      toast.success("Contact added successfully");
    }
    setContactForm(initialContactForm);
    setAddModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setContactForm(initialContactForm);
    setEditingContact(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">Contacts</h1>
          <p className="text-sm text-body">/ Contact Database</p>
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
            onClick={() => { setEditingContact(null); setContactForm(initialContactForm); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Contact
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Four summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Total</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1.5">Contacts</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider mb-1.5">Customers</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">{stats.customers}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Prospects</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">{stats.prospects}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserPlus className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">Leads</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">{stats.leads}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Contacts table section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-brand-dark mb-4">Contacts</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search contacts..."
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
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">City</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Source</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Owner</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Last Contact</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand font-semibold text-xs shrink-0">
                          {row.initials}
                        </span>
                        <span className="font-medium text-brand-dark">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.title}>{row.title}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.phone}>{row.phone}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.email}>{row.email}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.city}>{row.city}</td>
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
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                          {row.ownerInitials}
                        </span>
                        <span className="text-body truncate min-w-0" title={row.owner}>{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body tabular-nums whitespace-nowrap">{row.lastContact}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditContact(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit contact"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openViewContact(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="View contact"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
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

      {/* New Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingContact ? "Edit Contact" : "New Contact"}</h2>
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
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Contact Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">First name *</label>
                  <input
                    type="text"
                    value={contactForm.firstName}
                    onChange={(e) => handleContactFormChange("firstName", e.target.value)}
                    placeholder="First name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Last name *</label>
                  <input
                    type="text"
                    value={contactForm.lastName}
                    onChange={(e) => handleContactFormChange("lastName", e.target.value)}
                    placeholder="Last name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => handleContactFormChange("company", e.target.value)}
                    placeholder="Company"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Job title</label>
                  <input
                    type="text"
                    value={contactForm.jobTitle}
                    onChange={(e) => handleContactFormChange("jobTitle", e.target.value)}
                    placeholder="CEO, CTO..."
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Phone *</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => handleContactFormChange("phone", e.target.value)}
                    placeholder="+91 xxxxx xxxxx"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleContactFormChange("email", e.target.value)}
                    placeholder="email@company.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    value={contactForm.city}
                    onChange={(e) => handleContactFormChange("city", e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Country</label>
                  <input
                    type="text"
                    value={contactForm.country}
                    onChange={(e) => handleContactFormChange("country", e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={contactForm.status}
                    onChange={(e) => handleContactFormChange("status", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Lead source</label>
                  <select
                    value={contactForm.leadSource}
                    onChange={(e) => handleContactFormChange("leadSource", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {LEAD_SOURCES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Owner</label>
                  <select
                    value={contactForm.owner}
                    onChange={(e) => handleContactFormChange("owner", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {OWNERS.map((o) => (
                      <option key={o.initials} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Last contact date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={contactForm.lastContactDate}
                      onChange={(e) => handleContactFormChange("lastContactDate", e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Tags (comma sep)</label>
                  <input
                    type="text"
                    value={contactForm.tags}
                    onChange={(e) => handleContactFormChange("tags", e.target.value)}
                    placeholder="enterprise, tech"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes</label>
                  <textarea
                    value={contactForm.notes}
                    onChange={(e) => handleContactFormChange("notes", e.target.value)}
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
                onClick={handleSaveContact}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingContact ? "Save changes" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingContact(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">View Contact</h2>
              <button type="button" onClick={() => setViewingContact(null)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Name</span><p className="font-medium text-brand-dark mt-0.5">{viewingContact.name}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Company</span><p className="text-body mt-0.5">{viewingContact.company}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Title</span><p className="text-body mt-0.5">{viewingContact.title}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Phone</span><p className="text-body mt-0.5">{viewingContact.phone}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Email</span><p className="text-body mt-0.5">{viewingContact.email}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">City</span><p className="text-body mt-0.5">{viewingContact.city}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Status</span><p className="text-body mt-0.5">{viewingContact.status}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Source</span><p className="text-body mt-0.5">{viewingContact.source}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Owner</span><p className="text-body mt-0.5">{viewingContact.owner}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Last Contact</span><p className="text-body mt-0.5">{viewingContact.lastContact}</p></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
