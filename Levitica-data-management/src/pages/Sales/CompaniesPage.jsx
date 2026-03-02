import React, { useState, useEffect, useRef } from "react";
import { Bell, Building2, Plus, Pencil, Trash2, X, Save, User, LogOut } from "lucide-react";

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

function AddCompanyModal({ open, onClose, onSave, company: editingCompany }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "Technology",
    city: "",
    website: "",
    employees: "",
    annualRevenue: "",
    status: "Prospect",
    owner: "Vikram Joshi",
  });

  useEffect(() => {
    if (!open) return;
    if (editingCompany) {
      setForm({
        name: editingCompany.name || "",
        description: editingCompany.description || "",
        industry: editingCompany.industry || "Technology",
        city: editingCompany.city === "-" ? "" : (editingCompany.city || ""),
        website: editingCompany.website === "-" ? "" : (editingCompany.website || ""),
        employees: editingCompany.employees === "-" ? "" : String(editingCompany.employees || ""),
        annualRevenue: editingCompany.annualRevenue === "-" ? "" : (editingCompany.annualRevenue || ""),
        status: editingCompany.status || "Prospect",
        owner: editingCompany.owner || "Vikram Joshi",
      });
    } else {
      setForm({
        name: "",
        description: "",
        industry: "Technology",
        city: "",
        website: "",
        employees: "",
        annualRevenue: "",
        status: "Prospect",
        owner: "Vikram Joshi",
      });
    }
  }, [open, editingCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) return;
    const newCompany = {
      id: editingCompany?.id ?? Date.now(),
      name: form.name.trim(),
      description: form.description?.trim() || "",
      industry: form.industry,
      city: form.city?.trim() || "-",
      website: form.website?.trim() || "-",
      employees: form.employees ? parseInt(form.employees, 10) : "-",
      annualRevenue: form.annualRevenue?.trim() || "-",
      status: form.status,
      owner: form.owner,
      ownerInitials: getInitials(form.owner),
      contacts: editingCompany?.contacts ?? 0,
      deals: editingCompany?.deals ?? 0,
    };
    onSave(newCompany, !!editingCompany);
    setForm({
      name: "",
      description: "",
      industry: "Technology",
      city: "",
      website: "",
      employees: "",
      annualRevenue: "",
      status: "Prospect",
      owner: "Vikram Joshi",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingCompany ? "Edit Company" : "Add Company"}</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Company name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <select name="industry" value={form.industry} onChange={handleChange} className={inputClass}>
                  <option>Technology</option>
                  <option>Retail</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="example.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Employees</label>
                <input
                  type="number"
                  name="employees"
                  value={form.employees}
                  onChange={handleChange}
                  placeholder="Number of employees"
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Annual Revenue (₹)</label>
                <input
                  type="text"
                  name="annualRevenue"
                  value={form.annualRevenue}
                  onChange={handleChange}
                  placeholder="e.g. 5,00,00,000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option>Prospect</option>
                  <option>Customer</option>
                  <option>Lead</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Owner</label>
                <select name="owner" value={form.owner} onChange={handleChange} className={inputClass}>
                  <option>Vikram Joshi</option>
                  <option>Arjun Sharma</option>
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
            >
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

const INITIAL_COMPANIES = [
  {
    id: 1,
    name: "TechNova Pvt Ltd",
    description: "Top enterprise giant",
    industry: "Technology",
    city: "Bangalore",
    website: "technova.com",
    employees: 250,
    annualRevenue: "₹5,00,00,000",
    status: "Customer",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    contacts: 1,
    deals: 1,
  },
  {
    id: 2,
    name: "Horizon Retail Co",
    description: "Large retail chain",
    industry: "Retail",
    city: "Delhi",
    website: "horizon.co",
    employees: 500,
    annualRevenue: "₹12,00,00,000",
    status: "Prospect",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    contacts: 1,
    deals: 1,
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const handleSaveCompany = (c, isEdit) => {
    if (isEdit) {
      setCompanies((prev) => prev.map((x) => (x.id === c.id ? c : x)));
    } else {
      setCompanies((prev) => [c, ...prev]);
    }
    setEditingCompany(null);
    setShowAddModal(false);
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies((prev) => prev.filter((x) => x.id !== id));
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

  const filtered = companies.filter((row) => {
    const matchSearch =
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      (row.description && row.description.toLowerCase().includes(search.toLowerCase())) ||
      row.industry?.toLowerCase().includes(search.toLowerCase()) ||
      row.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Building2 className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Companies</h1>
            <p className="text-[13px] text-black/70">Company records and account management.</p>
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
            onClick={() => { setEditingCompany(null); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Company
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

      <AddCompanyModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingCompany(null); }}
        onSave={handleSaveCompany}
        company={editingCompany}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand" strokeWidth={2} />
              Companies ({filtered.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search companies..."
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
            <table className="w-full min-w-[1100px] text-sm table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-[11rem]" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-32" />
                <col className="w-20" />
                <col className="w-28" />
                <col className="w-24" />
                <col className="w-36" />
                <col className="w-16" />
                <col className="w-16" />
                <col className="w-16" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-black">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Industry</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">City</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Website</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Employees</th>
                  <th className="text-right py-3 px-3 font-semibold text-black">Annual Revenue</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Owner</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Contacts</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Deals</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                    <td className="py-3 px-3 text-right text-black tabular-nums align-top">{idx + 1}</td>
                    <td className="py-3 px-3 align-top min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium text-black truncate" title={row.name}>{row.name}</p>
                        {row.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate" title={row.description}>{row.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {row.industry}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-black truncate align-top" title={row.city}>{row.city}</td>
                    <td className="py-3 px-3 text-black truncate align-top min-w-0" title={row.website}>{row.website}</td>
                    <td className="py-3 px-3 text-center text-black tabular-nums align-top">{row.employees}</td>
                    <td className="py-3 px-3 text-right text-black tabular-nums whitespace-nowrap align-top">{row.annualRevenue}</td>
                    <td className="py-3 px-3 text-center align-top">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                          {row.ownerInitials}
                        </span>
                        <span className="text-black truncate min-w-0" title={row.owner}>{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-black tabular-nums align-top">{row.contacts}</td>
                    <td className="py-3 px-3 text-center text-black tabular-nums align-top">{row.deals}</td>
                    <td className="py-3 px-3 text-center align-top">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingCompany(row); setShowAddModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit company"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCompany(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete company"
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
            <div className="py-12 text-center text-body text-sm">No companies match your filters.</div>
          )}
        </div>
      </div>
    </>
  );
}
