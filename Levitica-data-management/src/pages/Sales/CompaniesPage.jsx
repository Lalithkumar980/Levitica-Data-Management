import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Building2,
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function mapCompanyToRow(company, ownerList = []) {
  let owner = company.owner && typeof company.owner === "object" ? company.owner : null;
  if (!owner && company.owner && ownerList.length) {
    const id = typeof company.owner === "string" ? company.owner : company.owner?.toString?.();
    const u = ownerList.find((o) => (o.id || o._id) === id);
    if (u) owner = { _id: u._id || u.id, name: u.name };
  }
  const ownerId = owner ? (owner._id || owner.id) : (company.owner && typeof company.owner === "string" ? company.owner : null);
  const contactsCount = Array.isArray(company.contacts) ? company.contacts.length : 0;
  const dealsCount = Array.isArray(company.deals) ? company.deals.length : 0;
  const revenue = company.revenue != null ? company.revenue : 0;
  const annualRevenue = revenue === 0 ? "₹0" : `₹${Number(revenue).toLocaleString("en-IN")}`;
  return {
    id: company._id,
    ownerId: ownerId || null,
    name: company.name || "—",
    description: company.notes || "—",
    industry: company.industry || "—",
    city: company.city || "—",
    website: company.website || "—",
    phone: company.phone || "—",
    employees: company.employees != null ? String(company.employees) : "0",
    annualRevenue,
    status: company.status || "Lead",
    owner: owner ? owner.name : "—",
    ownerInitials: getInitials(owner ? owner.name : ""),
    contacts: contactsCount,
    deals: dealsCount,
  };
}

const INDUSTRIES = ["Technology", "Consulting", "Retail", "Healthcare", "Education", "Finance", "Manufacturing", "Other"];
const STATUS_OPTIONS = ["Lead", "Prospect", "Customer", "Partner"];
const STATUS_STYLES = {
  Lead: "bg-blue-100 text-blue-700",
  Customer: "bg-emerald-100 text-emerald-700",
  Prospect: "bg-amber-100 text-amber-700",
  Partner: "bg-violet-100 text-violet-700",
};

const initialCompanyForm = {
  companyName: "",
  industry: "Technology",
  website: "",
  phone: "",
  city: "",
  country: "India",
  employees: "0",
  annualRevenue: "0",
  status: "Lead",
  assignedTo: "",
  notes: "",
};

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Rep", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Rep", email: "", initials: "—" };
  const currentUserId = storedUser && (storedUser._id || storedUser.id);

  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState(initialCompanyForm);
  const [editingCompany, setEditingCompany] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isRep = storedUser && storedUser.role === "Sales Rep";
  const canDelete = storedUser && storedUser.role === "Admin";

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to manage companies.");
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
        const companiesRes = await apiRequest("/api/v1/companies?page=1&limit=200");
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
        setCompanies((companiesRes.companies || []).map((c) => mapCompanyToRow(c, userList)));
        setUsers(userList);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load companies");
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

  const filtered = companies.filter((row) => {
    const matchSearch = !search || (row.name || "").toLowerCase().includes(search.toLowerCase()) || (row.industry || "").toLowerCase().includes(search.toLowerCase()) || (row.city || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    if (!canDelete) return;
    try {
      await apiRequest(`/api/v1/companies/${id}`, { method: "DELETE" });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      toast.success("Company deleted");
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to delete company");
    }
  };

  const openEditCompany = (row) => {
    setCompanyForm({
      companyName: row.name === "—" ? "" : row.name,
      industry: row.industry === "—" ? "Technology" : row.industry,
      website: row.website === "—" ? "" : row.website,
      phone: row.phone === "—" ? "" : row.phone,
      city: row.city === "—" ? "" : row.city,
      country: "India",
      employees: row.employees || "0",
      annualRevenue: (row.annualRevenue || "0").replace(/[₹,]/g, "").trim() || "0",
      status: row.status || "Lead",
      assignedTo: row.ownerId || (users[0] && (users[0].id || users[0]._id)) || currentUserId || "",
      notes: row.description === "—" ? "" : row.description,
    });
    setEditingCompany(row);
    setAddModalOpen(true);
  };

  const handleCompanyFormChange = (field, value) => {
    setCompanyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCompany = async () => {
    const { companyName, industry, website, phone, city, country, employees, annualRevenue, status, assignedTo, notes } = companyForm;
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    const ownerId = isRep ? currentUserId : (assignedTo || currentUserId);
    if (!ownerId && !editingCompany) {
      toast.error("Please assign an owner.");
      return;
    }
    const revenueVal = parseInt(String(annualRevenue).replace(/[₹,\s]/g, ""), 10) || 0;
    const payload = {
      name: companyName.trim(),
      industry: industry || undefined,
      city: city.trim() || undefined,
      country: (country && country.trim()) || "India",
      website: website.trim() || undefined,
      phone: phone.trim() || undefined,
      employees: parseInt(employees, 10) || 0,
      revenue: revenueVal,
      status: status || "Lead",
      notes: notes.trim() || undefined,
      owner: ownerId,
    };
    try {
      if (editingCompany) {
        const res = await apiRequest(`/api/v1/companies/${editingCompany.id}`, { method: "PUT", body: payload });
        const updated = mapCompanyToRow({ ...res.company, _id: res.company._id, owner: res.company.owner }, users);
        setCompanies((prev) => prev.map((c) => (c.id === editingCompany.id ? updated : c)));
        toast.success("Company updated successfully");
      } else {
        const res = await apiRequest("/api/v1/companies", { method: "POST", body: payload });
        const created = mapCompanyToRow({ ...res.company, _id: res.company._id, owner: res.company.owner }, users);
        setCompanies((prev) => [created, ...prev]);
        toast.success("Company added successfully");
      }
      setCompanyForm(initialCompanyForm);
      setEditingCompany(null);
      setAddModalOpen(false);
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to save company");
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setCompanyForm(initialCompanyForm);
    setEditingCompany(null);
  };

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
        <div className="flex items-center gap-3 shrink-0">
          <input type="search" placeholder="Search anything..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm" />
          <button type="button" className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition" aria-label="Notifications"><Bell className="w-5 h-5" strokeWidth={2} /></button>
          <button type="button" onClick={() => { setEditingCompany(null); setCompanyForm({ ...initialCompanyForm, assignedTo: isRep ? (currentUserId || "") : (users[0] && (users[0]._id || users[0].id)) || currentUserId || "" }); setAddModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Company
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

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2"><Building2 className="w-5 h-5 text-brand" strokeWidth={2} /> Companies ({filtered.length})</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input type="search" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8">
                <option>All Status</option>
                {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-body text-sm">Loading companies…</div>
          ) : (
            <React.Fragment>
              <div className="overflow-x-auto">
                <table className="w-max min-w-[1100px] text-sm table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
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
                        <td className="py-3 px-3 text-right tabular-nums">{idx + 1}</td>
                        <td className="py-3 px-3 min-w-0">
                          <p className="font-medium text-black truncate" title={row.name}>{row.name}</p>
                          {row.description && row.description !== "—" && <p className="text-xs text-gray-500 mt-0.5 truncate" title={row.description}>{row.description}</p>}
                        </td>
                        <td className="py-3 px-3"><span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{row.industry}</span></td>
                        <td className="py-3 px-3 truncate" title={row.city}>{row.city}</td>
                        <td className="py-3 px-3 truncate" title={row.website}>{row.website}</td>
                        <td className="py-3 px-3 text-center tabular-nums">{row.employees}</td>
                        <td className="py-3 px-3 text-right tabular-nums whitespace-nowrap">{row.annualRevenue}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>{row.status}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">{row.ownerInitials}</span>
                            <span className="text-black truncate min-w-0" title={row.owner}>{row.owner}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center tabular-nums">{row.contacts}</td>
                        <td className="py-3 px-3 text-center tabular-nums">{row.deals}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => openEditCompany(row)} className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition" aria-label="Edit company"><Pencil className="w-4 h-4" strokeWidth={2} /></button>
                            {canDelete && (
                              <button type="button" onClick={() => handleDelete(row.id)} className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition" aria-label="Delete company"><Trash2 className="w-4 h-4" strokeWidth={2} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && <div className="py-12 text-center text-body text-sm">No companies match your filters.</div>}
            </React.Fragment>
          )}
        </div>
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingCompany ? "Edit Company" : "Add Company"}</h2>
              <button type="button" onClick={closeAddModal} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close"><X className="w-5 h-5" strokeWidth={2} /></button>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Company name *</label>
                  <input type="text" value={companyForm.companyName} onChange={(e) => handleCompanyFormChange("companyName", e.target.value)} placeholder="Company name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <select value={companyForm.industry} onChange={(e) => handleCompanyFormChange("industry", e.target.value)} className={inputClass}>
                    {INDUSTRIES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={companyForm.status} onChange={(e) => handleCompanyFormChange("status", e.target.value)} className={inputClass}>
                    {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input type="text" value={companyForm.website} onChange={(e) => handleCompanyFormChange("website", e.target.value)} placeholder="example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="text" value={companyForm.phone} onChange={(e) => handleCompanyFormChange("phone", e.target.value)} placeholder="Phone" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={companyForm.city} onChange={(e) => handleCompanyFormChange("city", e.target.value)} placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Employees</label>
                  <input type="text" value={companyForm.employees} onChange={(e) => handleCompanyFormChange("employees", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Annual revenue (₹)</label>
                  <input type="text" value={companyForm.annualRevenue} onChange={(e) => handleCompanyFormChange("annualRevenue", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                {!isRep && users.length > 0 && (
                  <div>
                    <label className={labelClass}>Owner</label>
                    <select value={companyForm.assignedTo} onChange={(e) => handleCompanyFormChange("assignedTo", e.target.value)} className={inputClass}>
                      {users.map((u) => <option key={u.id || u._id} value={u.id || u._id}>{u.name || u.email}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className={labelClass}>Notes</label>
                <textarea value={companyForm.notes} onChange={(e) => handleCompanyFormChange("notes", e.target.value)} rows={2} placeholder="Notes" className={inputClass + " w-full resize-y"} />
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button type="button" onClick={closeAddModal} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">Cancel</button>
                <button type="button" onClick={handleSaveCompany} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"><Save className="w-4 h-4" strokeWidth={2} /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
