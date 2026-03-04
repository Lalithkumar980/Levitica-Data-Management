import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bell, Plus, Check, X, Users, User, Save, Eye, EyeOff, Pencil, LogOut } from "lucide-react";
import { apiRequest, getStoredUser, clearAuth } from "../../utils/api";

const ROLE_CLASS = {
  Admin: "bg-blue-100 text-blue-700",
  "Sales Manager": "bg-emerald-100 text-emerald-700",
  "Sales Rep": "bg-amber-100 text-amber-700",
};
const ROLE_DEFAULTS = {
  Admin: { viewAll: true, delete: true, export: true, admin: true, modules: ["/dashboard", "/leads", "/contacts", "/companies", "/deals -6"] },
  "Sales Manager": { viewAll: true, delete: false, export: true, admin: false, modules: ["/dashboard", "/leads", "/contacts", "/companies", "/deals -7"] },
  "Sales Rep": { viewAll: false, delete: false, export: true, admin: false, modules: ["/dashboard", "/leads", "/contacts", "/companies", "/deals -4"] },
};
const ROLES = ["Admin", "Sales Manager", "Sales Rep"];
const DEPARTMENTS = ["Management", "Sales Management", "Sales"];

const initialUserForm = {
  fullName: "",
  email: "",
  role: "Sales Rep",
  department: "Sales",
  password: "",
};

const ROLE_MATRIX = [
  { permission: "View All Records", admin: true, salesManager: true, salesRep: false },
  { permission: "Edit Own Records", admin: true, salesManager: true, salesRep: true },
  { permission: "Delete Records", admin: true, salesManager: false, salesRep: false },
  { permission: "Export Data", admin: true, salesManager: true, salesRep: false },
  { permission: "Bulk Import", admin: true, salesManager: true, salesRep: false },
  { permission: "Manage Users", admin: true, salesManager: false, salesRep: false },
  { permission: "View Reports", admin: true, salesManager: true, salesRep: true },
];

function getInitials(fullName) {
  const parts = (fullName || "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0] || "").slice(0, 2).toUpperCase() || "—";
}

export default function AdminUsersRolesPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser() || { name: "Admin", role: "Admin", email: "", initials: "AK" };
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [saving, setSaving] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [detailsEditMode, setDetailsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "Sales Rep", department: "Sales", password: "" });
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await apiRequest("/api/users");
        if (!cancelled) setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!cancelled && err.status === 401) {
          clearAuth();
          navigate("/login");
          return;
        }
        if (!cancelled) toast.error(err.message || "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleUserFormChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async () => {
    const { fullName, email, role, department, password } = userForm;
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in required fields (Name and Email).");
      return;
    }
    if (!password.trim()) {
      toast.error("Admin must set an initial password for the user.");
      return;
    }
    setSaving(true);
    try {
      const created = await apiRequest("/api/users", {
        method: "POST",
        body: { fullName: fullName.trim(), email: email.trim(), role, department: department || "Sales", password: password.trim() },
      });
      const newUser = {
        ...created,
        id: created.id || created._id,
        dept: created.dept ?? created.department,
      };
      setUsers((prev) => [newUser, ...prev]);
      setUserForm(initialUserForm);
      setAddModalOpen(false);
      toast.success("User added successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to add user");
    } finally {
      setSaving(false);
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setUserForm(initialUserForm);
  };

  const handleOpenEdit = () => {
    if (!selectedUser) return;
    setEditForm({
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      department: selectedUser.dept,
      password: "",
    });
    setDetailsEditMode(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    const { name, email, role, department, password } = editForm;
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required.");
      return;
    }
    setSavingEdit(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        role,
        department: department || "Sales",
      };
      if (password.trim()) payload.password = password.trim();
      const updated = await apiRequest(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        body: payload,
      });
      const updatedUser = {
        ...updated,
        id: updated.id || updated._id,
        dept: updated.dept ?? updated.department,
      };
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
      setSelectedUser(updatedUser);
      setDetailsEditMode(false);
      setEditForm({ name: "", email: "", role: "Sales Rep", department: "Sales", password: "" });
      toast.success("User updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setDetailsEditMode(false);
    setEditForm({ name: "", email: "", role: "Sales Rep", department: "Sales", password: "" });
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Users className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Users & Roles</h1>
            <p className="text-[13px] text-black/70">Manage users, roles, and permissions across the platform.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
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
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add User
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{currentUser.initials || "AK"}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{currentUser.initials || "AK"}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{currentUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{currentUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left">
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    My Profile
                  </button>
                  <button type="button" onClick={() => { clearAuth(); navigate("/login"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left">
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
        {/* KPI cards - same style as HR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Users</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{users.length}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Sales Reps</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{users.filter((u) => u.role === "Sales Rep").length}</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Managers</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{users.filter((u) => u.role === "Sales Manager").length}</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-6 h-6 text-emerald-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Admins</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{users.filter((u) => u.role === "Admin").length}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Users & Access Control */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Users className="w-5 h-5 text-brand" strokeWidth={2} />
              Users & Access Control
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-max min-w-[900px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-black w-10">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">User</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Email</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Role</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Dept</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Modules</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">Loading users…</td></tr>
                ) : (
                users.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    onClick={() => { setSelectedUser(row); setShowPassword(false); setDetailsEditMode(false); }}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition cursor-pointer text-black"
                  >
                    <td className="py-3 px-3 text-black tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.initials}
                        </span>
                        <span className="font-medium text-brand-dark">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.email}>{row.email}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${row.roleClass}`}>
                        {row.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.dept}>{row.dept}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {row.modules.map((m, i) => (
                          <span key={i} className="text-black text-xs flex items-center gap-0.5">
                            <Check className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={2.5} />
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        <span className={row.viewAll ? "text-success flex items-center gap-1" : "text-danger flex items-center gap-1"}>
                          {row.viewAll ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <X className="w-3.5 h-3.5" strokeWidth={2.5} />}
                          View All
                        </span>
                        <span className={row.delete ? "text-success flex items-center gap-1" : "text-danger flex items-center gap-1"}>
                          {row.delete ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <X className="w-3.5 h-3.5" strokeWidth={2.5} />}
                          Delete
                        </span>
                        <span className={row.export ? "text-success flex items-center gap-1" : "text-danger flex items-center gap-1"}>
                          {row.export ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <X className="w-3.5 h-3.5" strokeWidth={2.5} />}
                          Export
                        </span>
                        <span className={row.admin ? "text-success flex items-center gap-1" : "text-danger flex items-center gap-1"}>
                          {row.admin ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <X className="w-3.5 h-3.5" strokeWidth={2.5} />}
                          Admin
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permission Matrix */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-brand-dark">Role Permission Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Permission</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Admin</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Sales Manager</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Sales Rep</th>
                </tr>
              </thead>
              <tbody>
                {ROLE_MATRIX.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-3 px-4 font-medium text-brand-dark">{row.permission}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={row.admin ? "text-success inline-flex items-center gap-1" : "text-danger inline-flex items-center gap-1"}>
                        {row.admin ? <><Check className="w-4 h-4" strokeWidth={2.5} /> Yes</> : <><X className="w-4 h-4" strokeWidth={2.5} /> No</>}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={row.salesManager ? "text-success inline-flex items-center gap-1" : "text-danger inline-flex items-center gap-1"}>
                        {row.salesManager ? <><Check className="w-4 h-4" strokeWidth={2.5} /> Yes</> : <><X className="w-4 h-4" strokeWidth={2.5} /> No</>}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={row.salesRep ? "text-success inline-flex items-center gap-1" : "text-danger inline-flex items-center gap-1"}>
                        {row.salesRep ? <><Check className="w-4 h-4" strokeWidth={2.5} /> Yes</> : <><X className="w-4 h-4" strokeWidth={2.5} /> No</>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">Add User</h2>
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
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">User Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Full name *</label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) => handleUserFormChange("fullName", e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => handleUserFormChange("email", e.target.value)}
                    placeholder="user@company.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => handleUserFormChange("role", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Department</label>
                  <select
                    value={userForm.department}
                    onChange={(e) => handleUserFormChange("department", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Password *</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => handleUserFormChange("password", e.target.value)}
                    placeholder="Admin creates initial password for the user"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
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
                onClick={handleSaveUser}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition disabled:opacity-70"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {saving ? "Saving…" : "Save User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setSelectedUser(null); setDetailsEditMode(false); }} aria-hidden />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{detailsEditMode ? "Edit User" : "User Details"}</h2>
              <button
                type="button"
                onClick={() => { setSelectedUser(null); setDetailsEditMode(false); }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5">
              {detailsEditMode ? (
                /* Edit form */
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-3 border-b border-brand/30 pb-2">Profile</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Full name *</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleEditFormChange("name", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEditFormChange("email", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Role</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => handleEditFormChange("role", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Department</label>
                      <select
                        value={editForm.department}
                        onChange={(e) => handleEditFormChange("department", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">New password (optional)</label>
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) => handleEditFormChange("password", e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-lg shrink-0">
                      {selectedUser.initials}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-dark text-lg">{selectedUser.name}</p>
                      <p className="text-sm text-body">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-3 border-b border-brand/30 pb-2">Profile</p>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-body">Role</dt>
                        <dd>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedUser.roleClass}`}>
                            {selectedUser.role}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-body">Department</dt>
                        <dd className="font-medium text-brand-dark">{selectedUser.dept}</dd>
                      </div>
                      <div className="flex justify-between gap-4 items-center">
                        <dt className="text-body">Password</dt>
                        <dd className="flex items-center gap-2">
                          <span className="text-body font-mono">
                            {showPassword
                              ? (selectedUser.passwordDisplay != null && selectedUser.passwordDisplay !== ""
                                ? selectedUser.passwordDisplay
                                : "Set (use Edit to set a new password to display it)")
                              : "••••••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="text-brand hover:text-brand-dark text-xs font-medium flex items-center gap-1"
                          >
                            {showPassword ? (
                              <>
                                <EyeOff className="w-4 h-4" strokeWidth={2} />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" strokeWidth={2} />
                                Show
                              </>
                            )}
                          </button>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">Modules</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {selectedUser.modules.map((m, i) => (
                        <li key={i} className="inline-flex items-center gap-1 text-xs text-body bg-gray-50 px-2 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={2.5} />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                      <span className={selectedUser.viewAll ? "text-success flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}>
                        {selectedUser.viewAll ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <X className="w-4 h-4" strokeWidth={2.5} />}
                        View All
                      </span>
                      <span className={selectedUser.delete ? "text-success flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}>
                        {selectedUser.delete ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <X className="w-4 h-4" strokeWidth={2.5} />}
                        Delete
                      </span>
                      <span className={selectedUser.export ? "text-success flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}>
                        {selectedUser.export ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <X className="w-4 h-4" strokeWidth={2.5} />}
                        Export
                      </span>
                      <span className={selectedUser.admin ? "text-success flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}>
                        {selectedUser.admin ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <X className="w-4 h-4" strokeWidth={2.5} />}
                        Admin
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-white">
              {detailsEditMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={savingEdit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" strokeWidth={2} />
                    {savingEdit ? "Saving…" : "Save"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setSelectedUser(null); setDetailsEditMode(false); }}
                    className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenEdit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={2} />
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
