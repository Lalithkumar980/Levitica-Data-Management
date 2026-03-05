import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bell, FileText, Plus, Download, Pencil, X, Save, Wallet, Clock, AlertCircle, Hash, User, LogOut } from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const formatINR = (n) => (n == null || isNaN(n) ? "0" : "₹" + Number(n).toLocaleString("en-IN"));
const parseINR = (str) => parseFloat(String(str ?? "").replace(/[₹,\s]/g, "")) || 0;

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function toISODate(s) {
  if (!s || s === "-") return undefined;
  const parts = String(s).trim().split(/[-/]/);
  if (parts.length === 3) {
    const [a, b, c] = parts;
    if (a.length === 4) return `${a}-${b.padStart(2, "0")}-${c.padStart(2, "0")}`;
    return `${c}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
  }
  return s;
}

function formatDate(v) {
  if (v == null || v === "" || v === "-") return "-";
  const d = typeof v === "string" ? new Date(v) : v;
  if (isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

const getDefaultForm = (todayStr) => ({
  invoiceNumber: "INV-" + Math.floor(100000 + Math.random() * 900000),
  client: "",
  type: "Company",
  category: "Revenue",
  baseAmount: "",
  status: "Pending",
  paymentMethod: "",
  invoiceDate: todayStr,
  dueDate: "",
  paidDate: "",
  description: "",
});

function NewInvoiceModal({ open, onClose, onSave, invoice: editingInvoice }) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayStr = `${dd}-${mm}-${yyyy}`;

  const [form, setForm] = useState(getDefaultForm(todayStr));

  useEffect(() => {
    if (!open) return;
    if (editingInvoice) {
      const base = typeof editingInvoice.baseAmount === "number" ? editingInvoice.baseAmount : parseINR(editingInvoice.baseAmount);
      setForm({
        invoiceNumber: editingInvoice.invoiceNo,
        client: editingInvoice.client,
        type: editingInvoice.type || "Company",
        category: "Revenue",
        baseAmount: base > 0 ? String(base) : "",
        status: editingInvoice.status || "Pending",
        paymentMethod: (editingInvoice.paymentMethod || editingInvoice.method) === "-" || !(editingInvoice.paymentMethod || editingInvoice.method) ? "" : (editingInvoice.paymentMethod || editingInvoice.method),
        invoiceDate: !editingInvoice.invoiceDate || editingInvoice.invoiceDate === "-" ? todayStr : formatDate(editingInvoice.invoiceDate),
        dueDate: !editingInvoice.dueDate || editingInvoice.dueDate === "-" ? "" : formatDate(editingInvoice.dueDate),
        paidDate: !editingInvoice.paidDate || editingInvoice.paidDate === "-" ? "" : formatDate(editingInvoice.paidDate),
        description: !editingInvoice.description || editingInvoice.description === "-" ? "" : editingInvoice.description,
      });
    } else {
      setForm(getDefaultForm(todayStr));
    }
  }, [open, editingInvoice, todayStr]);

  const baseNum = parseFloat(String(form.baseAmount).replace(/,/g, "")) || 0;
  const gstNum = Math.round(baseNum * 0.18);
  const totalNum = baseNum + gstNum;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client?.trim()) return;
    const base = baseNum;
    const gst = gstNum;
    const total = base + gst;
    const payload = {
      id: editingInvoice ? (editingInvoice._id || editingInvoice.id) : null,
      invoiceNo: form.invoiceNumber,
      client: form.client.trim(),
      type: form.type,
      baseAmount: base,
      gst,
      total,
      status: form.status,
      method: form.paymentMethod || "-",
      paymentMethod: form.paymentMethod || "",
      invoiceDate: form.invoiceDate || "-",
      dueDate: form.dueDate || "-",
      paidDate: form.paidDate || "-",
      description: form.description?.trim() || "-",
    };
    onSave(payload, !!editingInvoice);
    if (!editingInvoice) setForm(getDefaultForm(todayStr));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-blue-500">{editingInvoice ? "Edit Invoice" : "New Invoice"}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Invoice Number</label>
                <input type="text" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Client / Party *</label>
                <input type="text" name="client" value={form.client} onChange={handleChange} placeholder="Client or candidate name" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                  <option>Company</option>
                  <option>Training</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                  <option>Revenue</option>
                  <option>Expense</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Amounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Base Amount (₹) *</label>
                <input type="number" name="baseAmount" value={form.baseAmount} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>GST (18%) - AUTO</label>
                <input type="text" readOnly value={formatINR(gstNum)} className={inputClass + " bg-gray-50"} />
              </div>
              <div>
                <label className={labelClass}>Total (Incl. GST)</label>
                <input type="text" readOnly value={formatINR(totalNum)} className={inputClass + " bg-gray-50"} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                  <option>Partial</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Credit Card</option>
                  <option>Cash</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Invoice Date</label>
                <input type="text" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Due Date</label>
                <input type="text" name="dueDate" value={form.dueDate} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Paid Date</label>
                <input type="text" name="paidDate" value={form.paidDate} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Additional notes" className={inputClass} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition">
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
  Paid: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Overdue: "bg-danger/15 text-danger",
  Partial: "bg-amber-100 text-amber-700",
};

const TYPE_STYLES = {
  Company: "bg-teal-100 text-teal-700",
  Training: "bg-brand-soft text-brand",
};

function invoiceToRow(doc) {
  const totalNum = doc.total != null ? Number(doc.total) : 0;
  return {
    _id: doc._id,
    id: doc._id,
    invoiceNo: doc.invoiceNo,
    client: doc.client,
    type: doc.type || "Company",
    baseAmount: formatINR(doc.baseAmount),
    gst: formatINR(doc.gst),
    total: formatINR(doc.total),
    totalNum,
    status: doc.status || "Pending",
    method: doc.paymentMethod || "-",
    paymentMethod: doc.paymentMethod,
    invoiceDate: doc.invoiceDate ? formatDate(doc.invoiceDate) : "-",
    dueDate: doc.dueDate ? formatDate(doc.dueDate) : "-",
    paidDate: doc.paidDate ? formatDate(doc.paidDate) : "-",
    description: doc.description || "-",
  };
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Finance Management", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Finance Management", email: "", initials: "—" };

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const errorToastShownRef = useRef(false);

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to view invoices.");
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  const fetchInvoices = async () => {
    if (!getToken()) return;
    errorToastShownRef.current = false;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "200" });
      if (statusFilter !== "All Status") params.set("status", statusFilter);
      if (typeFilter !== "All Types") params.set("type", typeFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await apiRequest(`/api/v1/finance/invoices?${params}`);
      const items = (res.items || []).map(invoiceToRow);
      setInvoices(items);
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      if (!errorToastShownRef.current) {
        errorToastShownRef.current = true;
        toast.error(err.message || "Failed to load invoices");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = invoices.filter((row) => {
    const matchSearch =
      !search ||
      (row.client && row.client.toLowerCase().includes(search.toLowerCase())) ||
      (row.invoiceNo && row.invoiceNo.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const handleSave = async (payload, isEdit) => {
    try {
      const body = {
        invoiceNo: payload.invoiceNo,
        client: payload.client,
        type: payload.type || "Company",
        category: "Revenue",
        baseAmount: typeof payload.baseAmount === "number" ? payload.baseAmount : parseINR(String(payload.baseAmount)),
        status: payload.status || "Pending",
        paymentMethod: payload.paymentMethod || payload.method || "",
        invoiceDate: toISODate(payload.invoiceDate),
        dueDate: toISODate(payload.dueDate),
        paidDate: toISODate(payload.paidDate),
        description: payload.description === "-" ? "" : (payload.description || ""),
      };
      if (isEdit && payload.id) {
        await apiRequest(`/api/v1/finance/invoices/${payload.id}`, { method: "PUT", body });
        toast.success("Invoice updated.");
      } else {
        await apiRequest("/api/v1/finance/invoices", { method: "POST", body });
        toast.success("Invoice created.");
      }
      fetchInvoices();
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to save invoice");
    }
  };

  const handleExport = () => {
    const escapeCsv = (val) => {
      const s = String(val ?? "").trim();
      if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const headers = [
      "S.No",
      "Invoice",
      "Client",
      "Type",
      "Base Amount",
      "GST (18%)",
      "Total",
      "Status",
      "Method",
      "Invoice Date",
      "Due Date",
      "Paid Date",
      "Description",
    ];
    const rows = filtered.map((row, idx) => [
      idx + 1,
      row.invoiceNo,
      row.client,
      row.type,
      row.baseAmount,
      row.gst,
      row.total,
      row.status,
      row.method,
      row.invoiceDate,
      row.dueDate,
      row.paidDate,
      row.description,
    ]);
    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((r) => r.map(escapeCsv).join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <FileText className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Invoices</h1>
            <p className="text-[13px] text-black/70">Create and manage invoices, billing, and collections.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            onClick={() => { setEditingInvoice(null); setShowNewInvoiceModal(true); }}
            className="bg-blue-500 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            New Invoice
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {currentUser.initials}
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {currentUser.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{currentUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{currentUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left"
                  >
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearAuth(); navigate("/login"); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <NewInvoiceModal
        open={showNewInvoiceModal}
        onClose={() => { setShowNewInvoiceModal(false); setEditingInvoice(null); }}
        onSave={handleSave}
        invoice={editingInvoice}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-body">Loading invoices…</div>
        ) : (
          <>
            {(() => {
              const totalCollected = filtered.filter((r) => r.status === "Paid").reduce((s, r) => s + (r.totalNum || 0), 0);
              const pending = filtered.filter((r) => r.status === "Pending").reduce((s, r) => s + (r.totalNum || 0), 0);
              const overdue = filtered.filter((r) => r.status === "Overdue").reduce((s, r) => s + (r.totalNum || 0), 0);
              const totalInvoiced = filtered.reduce((s, r) => s + (r.totalNum || 0), 0);
              const companyCount = filtered.filter((r) => r.type === "Company").length;
              const trainingCount = filtered.filter((r) => r.type === "Training").length;
              const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Total Collected</p>
                          <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{formatINR(totalCollected)}</p>
                          <p className="text-xs font-medium text-teal-700/80 mt-1.5">Collected</p>
                        </div>
                        <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Wallet className="w-6 h-6 text-teal-700" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                    <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Pending</p>
                          <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{formatINR(pending)}</p>
                          <p className="text-xs font-medium text-amber-700/80 mt-1.5">Awaiting payment</p>
                        </div>
                        <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Clock className="w-6 h-6 text-amber-700" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                    <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Overdue</p>
                          <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{formatINR(overdue)}</p>
                          <p className="text-xs font-medium text-red-700/80 mt-1.5">Past due</p>
                        </div>
                        <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <AlertCircle className="w-6 h-6 text-red-700" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                    <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Invoiced</p>
                          <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{formatINR(totalInvoiced)}</p>
                          <p className="text-xs font-medium text-blue-700/80 mt-1.5">All time</p>
                        </div>
                        <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6 text-blue-700" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                    <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Company Invoices</p>
                          <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{companyCount}</p>
                          <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
                        </div>
                        <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Hash className="w-6 h-6 text-teal-700" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                    <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Training Fees</p>
                          <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">{trainingCount}</p>
                          <p className="text-xs font-medium text-violet-700/80 mt-1.5">Count</p>
                        </div>
                        <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6 text-violet-700" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection Rate</span>
                    <span className="text-2xl font-bold text-success">{collectionRate}%</span>
                  </div>
                </>
              );
            })()}

        {/* Invoice Ledger – same card header style as HR DashboardOverview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-brand-soft/80 to-transparent flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
              <h2 className="text-sm font-semibold text-black">Invoice Ledger</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search client, invoice"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-48"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
                <option>Partial</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Types</option>
                <option>Company</option>
                <option>Training</option>
              </select>
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-brand-light text-sm font-medium transition"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1000px] text-sm table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-28" />
                <col className="w-[10rem]" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-52" />
                <col className="w-16" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Invoice</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Client</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Type</th>
                  <th className="text-right py-3 px-3 font-semibold text-black">Base Amount</th>
                  <th className="text-right py-3 px-3 font-semibold text-black">GST (18%)</th>
                  <th className="text-right py-3 px-3 font-semibold text-black">Total</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Method</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Invoice Date</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Due Date</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Paid Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Description</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row._id || row.id || idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-right text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark whitespace-nowrap">{row.invoiceNo}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.client}>{row.client}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-body tabular-nums whitespace-nowrap">{row.baseAmount}</td>
                    <td className="py-3 px-3 text-right text-body tabular-nums whitespace-nowrap">{row.gst}</td>
                    <td className="py-3 px-3 text-right font-medium text-brand-dark tabular-nums whitespace-nowrap">{row.total}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.method}>{row.method}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.invoiceDate}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.dueDate}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.paidDate}</td>
                    <td className="py-3 px-3 text-body truncate max-w-0" title={row.description}>{row.description}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => { setEditingInvoice(row); setShowNewInvoiceModal(true); }}
                        className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                        aria-label="Edit invoice"
                      >
                        <Pencil className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-body text-sm">No invoices match your filters.</div>
          )}
        </div>
        </>
        )}
      </div>
    </>
  );
}
