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
  Users,
  UserCheck,
  UserPlus,
  Target,
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function mapContactToRow(contact, ownerList = []) {
  let owner = contact.owner && typeof contact.owner === "object" ? contact.owner : null;
  if (!owner && contact.owner && ownerList.length) {
    const id = typeof contact.owner === "string" ? contact.owner : contact.owner?.toString?.();
    const u = ownerList.find((o) => (o.id || o._id) === id);
    if (u) owner = { _id: u._id || u.id, name: u.name };
  }
  const ownerId = owner ? (owner._id || owner.id) : (contact.owner && typeof contact.owner === "string" ? contact.owner : null);
  const lastContact = contact.lastContact ? new Date(contact.lastContact).toISOString().slice(0, 10) : "—";
  return {
    id: contact._id,
    ownerId: ownerId || null,
    name: [contact.fname, contact.lname].filter(Boolean).join(" ") || "—",
    initials: getInitials([contact.fname, contact.lname].filter(Boolean).join(" ")),
    company: contact.company || "—",
    title: contact.title || "—",
    phone: contact.phone || "—",
    email: contact.email || "—",
    city: contact.city || "—",
    status: contact.status || "Lead",
    source: contact.source || "—",
    owner: owner ? owner.name : "—",
    ownerInitials: getInitials(owner ? owner.name : ""),
    lastContact,
  };
}

const STATUS_OPTIONS = ["Lead", "Prospect", "Customer"];
const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "LinkedIn", "Event/Trade Show", "Partner", "Email Campaign", "Other"];
const STATUS_STYLES = { Customer: "bg-emerald-100 text-emerald-700", Prospect: "bg-amber-100 text-amber-700", Lead: "bg-blue-100 text-blue-700" };
const SOURCE_STYLES = {
  Referral: "bg-success/15 text-success", Website: "bg-blue-100 text-blue-700", "Cold Call": "bg-amber-100 text-amber-700",
  "Event/Trade Show": "bg-violet-100 text-violet-700", LinkedIn: "bg-blue-100 text-blue-700", Partner: "bg-emerald-100 text-emerald-700", Other: "bg-gray-100 text-gray-700",
};

const initialContactForm = {
  firstName: "", lastName: "", company: "", jobTitle: "", phone: "", email: "", city: "", country: "India",
  status: "Lead", leadSource: "Website", assignedTo: "", lastContactDate: "", tags: "", notes: "",
};

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

export default function ContactsPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Rep", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Rep", email: "", initials: "—" };
  const currentUserId = storedUser && (storedUser._id || storedUser.id);

  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [editingContact, setEditingContact] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isRep = storedUser && storedUser.role === "Sales Rep";
  const canDelete = storedUser && storedUser.role === "Admin";

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to manage contacts.");
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
        const contactsRes = await apiRequest("/api/v1/contacts?page=1&limit=200");
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
        setContacts((contactsRes.contacts || []).map((c) => mapContactToRow(c, userList)));
        setUsers(userList);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load contacts");
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

  const filtered = contacts.filter((row) => {
    const matchSearch = !search || (row.name || "").toLowerCase().includes(search.toLowerCase()) || (row.company || "").toLowerCase().includes(search.toLowerCase()) || (row.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: contacts.length,
    customers: contacts.filter((c) => c.status === "Customer").length,
    prospects: contacts.filter((c) => c.status === "Prospect").length,
    leads: contacts.filter((c) => c.status === "Lead").length,
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    try {
      await apiRequest(`/api/v1/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contact deleted");
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to delete contact");
    }
  };

  const openEditContact = (row) => {
    const parts = (row.name || "").trim().split(/\s+/);
    setContactForm({
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      company: row.company === "—" ? "" : row.company,
      jobTitle: row.title === "—" ? "" : row.title,
      phone: row.phone === "—" ? "" : row.phone,
      email: row.email === "—" ? "" : row.email,
      city: row.city === "—" ? "" : row.city,
      country: "India",
      status: row.status || "Lead",
      leadSource: row.source === "—" ? "Website" : row.source,
      assignedTo: row.ownerId || (users[0] && (users[0].id || users[0]._id)) || currentUserId || "",
      lastContactDate: row.lastContact && row.lastContact !== "—" ? row.lastContact : "",
      tags: "",
      notes: "",
    });
    setEditingContact(row);
    setAddModalOpen(true);
  };

  const handleContactFormChange = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveContact = async () => {
    const { firstName, lastName, company, jobTitle, phone, email, city, country, status, leadSource, assignedTo, lastContactDate, tags, notes } = contactForm;
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      toast.error("First name, last name and phone are required");
      return;
    }
    const ownerId = isRep ? currentUserId : (assignedTo || currentUserId);
    if (!ownerId && !editingContact) {
      toast.error("Please assign an owner.");
      return;
    }
    let lastContact = lastContactDate;
    if (lastContact && /^\d{2}-\d{2}-\d{4}$/.test(lastContact)) {
      const [d, m, y] = lastContact.split("-");
      lastContact = `${y}-${m}-${d}`;
    }
    if (!lastContact) lastContact = new Date().toISOString().slice(0, 10);
    const payload = {
      fname: firstName.trim(),
      lname: lastName.trim(),
      company: company.trim() || undefined,
      title: jobTitle.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city.trim() || undefined,
      country: (country && country.trim()) || "India",
      source: leadSource,
      status: status || "Lead",
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      notes: notes.trim() || undefined,
      lastContact: lastContact || undefined,
      owner: ownerId,
    };
    try {
      if (editingContact) {
        const res = await apiRequest(`/api/v1/contacts/${editingContact.id}`, { method: "PUT", body: payload });
        const updated = mapContactToRow({ ...res.contact, _id: res.contact._id, owner: res.contact.owner }, users);
        setContacts((prev) => prev.map((c) => (c.id === editingContact.id ? updated : c)));
        toast.success("Contact updated successfully");
      } else {
        const res = await apiRequest("/api/v1/contacts", { method: "POST", body: payload });
        const created = mapContactToRow({ ...res.contact, _id: res.contact._id, owner: res.contact.owner }, users);
        setContacts((prev) => [created, ...prev]);
        toast.success("Contact added successfully");
      }
      setContactForm(initialContactForm);
      setEditingContact(null);
      setAddModalOpen(false);
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to save contact");
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setContactForm(initialContactForm);
    setEditingContact(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <UserCheck className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Contacts</h1>
            <p className="text-[13px] text-black/70">Manage CRM contacts and relationships.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input type="search" placeholder="Search anything..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm" />
          <button type="button" className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition" aria-label="Notifications"><Bell className="w-5 h-5" strokeWidth={2} /></button>
          <button type="button" onClick={() => { setEditingContact(null); setContactForm({ ...initialContactForm, assignedTo: isRep ? (currentUserId || "") : (users[0] && (users[0]._id || users[0].id)) || currentUserId || "" }); setAddModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Contact
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Contacts</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{stats.total}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Users className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Customers</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{stats.customers}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform"><UserCheck className="w-6 h-6 text-teal-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Prospects</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{stats.prospects}</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform"><UserPlus className="w-6 h-6 text-amber-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Leads</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{stats.leads}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Target className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2"><Users className="w-5 h-5 text-brand" strokeWidth={2} /> Contacts</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input type="search" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8">
                <option>All Status</option>
                {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-body text-sm">Loading contacts…</div>
          ) : (
            <React.Fragment>
              <div className="overflow-x-auto">
                <table className="w-max min-w-[1000px] text-sm table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-semibold text-black">S.No</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Name</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Title</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Phone</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Email</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">City</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Status</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Source</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Owner</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Last Contact</th>
                      <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                        <td className="py-3 px-3 text-black tabular-nums">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand font-semibold text-xs shrink-0">{row.initials}</span>
                            <span className="font-medium text-brand-dark">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-black truncate" title={row.company}>{row.company}</td>
                        <td className="py-3 px-3 text-black truncate" title={row.title}>{row.title}</td>
                        <td className="py-3 px-3 text-black truncate" title={row.phone}>{row.phone}</td>
                        <td className="py-3 px-3 text-black truncate" title={row.email}>{row.email}</td>
                        <td className="py-3 px-3 text-black truncate" title={row.city}>{row.city}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>{row.status}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_STYLES[row.source] || "bg-gray-100 text-gray-700"}`}>{row.source}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">{row.ownerInitials}</span>
                            <span className="text-black truncate min-w-0" title={row.owner}>{row.owner}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-black tabular-nums whitespace-nowrap">{row.lastContact}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => openEditContact(row)} className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition" aria-label="Edit contact"><Pencil className="w-4 h-4" strokeWidth={2} /></button>
                            {canDelete && (
                              <button type="button" onClick={() => handleDelete(row.id)} className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition" aria-label="Delete contact"><Trash2 className="w-4 h-4" strokeWidth={2} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && <div className="py-12 text-center text-body text-sm">No contacts match your filters.</div>}
            </React.Fragment>
          )}
        </div>
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingContact ? "Edit Contact" : "New Contact"}</h2>
              <button type="button" onClick={closeAddModal} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close"><X className="w-5 h-5" strokeWidth={2} /></button>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First name *</label>
                  <input type="text" value={contactForm.firstName} onChange={(e) => handleContactFormChange("firstName", e.target.value)} placeholder="First name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last name *</label>
                  <input type="text" value={contactForm.lastName} onChange={(e) => handleContactFormChange("lastName", e.target.value)} placeholder="Last name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input type="text" value={contactForm.company} onChange={(e) => handleContactFormChange("company", e.target.value)} placeholder="Company" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Job title</label>
                  <input type="text" value={contactForm.jobTitle} onChange={(e) => handleContactFormChange("jobTitle", e.target.value)} placeholder="CEO, CTO..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input type="text" value={contactForm.phone} onChange={(e) => handleContactFormChange("phone", e.target.value)} placeholder="+91 xxxxx xxxxx" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={contactForm.email} onChange={(e) => handleContactFormChange("email", e.target.value)} placeholder="email@company.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={contactForm.city} onChange={(e) => handleContactFormChange("city", e.target.value)} placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={contactForm.status} onChange={(e) => handleContactFormChange("status", e.target.value)} className={inputClass}>
                    {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Lead source</label>
                  <select value={contactForm.leadSource} onChange={(e) => handleContactFormChange("leadSource", e.target.value)} className={inputClass}>
                    {LEAD_SOURCES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                {!isRep && users.length > 0 && (
                  <div>
                    <label className={labelClass}>Owner</label>
                    <select value={contactForm.assignedTo} onChange={(e) => handleContactFormChange("assignedTo", e.target.value)} className={inputClass}>
                      {users.map((u) => <option key={u.id || u._id} value={u.id || u._id}>{u.name || u.email}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className={labelClass}>Last contact date (yyyy-mm-dd)</label>
                  <input type="text" value={contactForm.lastContactDate} onChange={(e) => handleContactFormChange("lastContactDate", e.target.value)} placeholder="yyyy-mm-dd or dd-mm-yyyy" className={inputClass} />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClass}>Notes</label>
                <textarea value={contactForm.notes} onChange={(e) => handleContactFormChange("notes", e.target.value)} rows={2} placeholder="Notes" className={inputClass + " w-full resize-y"} />
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button type="button" onClick={closeAddModal} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">Cancel</button>
                <button type="button" onClick={handleSaveContact} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"><Save className="w-4 h-4" strokeWidth={2} /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
