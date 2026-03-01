import React, { useState } from "react";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Calendar,
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
  };

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
    const newContact = {
      id: Math.max(0, ...contacts.map((c) => c.id)) + 1,
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
    setContacts((prev) => [newContact, ...prev]);
    setContactForm(initialContactForm);
    setAddModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setContactForm(initialContactForm);
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
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Contact
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Four summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-brand-dark">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Customers</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.customers}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Prospects</p>
            <p className="text-2xl font-bold text-amber-600">{stats.prospects}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Leads</p>
            <p className="text-2xl font-bold text-blue-600">{stats.leads}</p>
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
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">City</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Source</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Owner</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Last Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 text-body">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.initials}
                        </span>
                        <span className="font-medium text-brand-dark">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-body">{row.company}</td>
                    <td className="py-4 px-4 text-body">{row.title}</td>
                    <td className="py-4 px-4 text-body">{row.phone}</td>
                    <td className="py-4 px-4 text-body">{row.email}</td>
                    <td className="py-4 px-4 text-body">{row.city}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLES[row.source] || "bg-gray-100 text-gray-700"}`}>
                        {row.source}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-brand/80 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.ownerInitials}
                        </span>
                        <span className="text-body">{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-body">{row.lastContact}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit contact"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
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
              <h2 className="text-lg font-bold text-brand-dark">New Contact</h2>
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
