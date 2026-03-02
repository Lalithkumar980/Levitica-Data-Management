import React, { useState, useEffect, useRef } from "react";
import { Bell, Wallet, Plus, Download, Pencil, X, Save, CreditCard, RefreshCw, Hash, User, LogOut } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const formatINR = (n) => (n == null || isNaN(n) ? "0" : "₹" + Number(n).toLocaleString("en-IN"));
const parseINR = (str) => parseFloat(String(str ?? "").replace(/[₹,\s]/g, "")) || 0;

const getDefaultForm = (todayStr) => ({
  title: "",
  category: "Infrastructure",
  amount: "",
  vendor: "",
  status: "Paid",
  paymentMethod: "",
  date: todayStr,
  receiptNo: "REF-" + String(Math.floor(100 + Math.random() * 900)).padStart(3, "0"),
  recurring: "No",
  notes: "",
});

function AddExpenseModal({ open, onClose, onSave, expense: editingExpense }) {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

  const [form, setForm] = useState(getDefaultForm(todayStr));

  useEffect(() => {
    if (!open) return;
    if (editingExpense) {
      const amount = parseINR(editingExpense.amount);
      const recurringVal = editingExpense.recurring === "One-off" ? "No" : editingExpense.recurring;
      setForm({
        title: editingExpense.title,
        category: editingExpense.category,
        amount: amount > 0 ? String(amount) : "",
        vendor: editingExpense.vendor === "-" ? "" : editingExpense.vendor,
        status: editingExpense.status,
        paymentMethod: editingExpense.method === "-" ? "" : editingExpense.method,
        date: editingExpense.date === "-" ? todayStr : editingExpense.date,
        receiptNo: editingExpense.receiptNo === "-" ? "" : editingExpense.receiptNo,
        recurring: recurringVal,
        notes: editingExpense.notes === "-" ? "" : editingExpense.notes,
      });
    } else {
      setForm(getDefaultForm(todayStr));
    }
  }, [open, editingExpense, todayStr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return;
    const amountNum = parseFloat(String(form.amount).replace(/,/g, "")) || 0;
    const recurringDisplay = form.recurring === "No" ? "One-off" : form.recurring;
    const payload = {
      id: editingExpense ? editingExpense.id : Date.now(),
      title: form.title.trim(),
      category: form.category,
      amount: formatINR(amountNum),
      vendor: form.vendor?.trim() || "-",
      status: form.status,
      method: form.paymentMethod || "-",
      date: form.date || "-",
      recurring: recurringDisplay,
      receiptNo: form.receiptNo?.trim() || "-",
      notes: form.notes?.trim() || "-",
    };
    onSave(payload, !!editingExpense);
    if (!editingExpense) setForm(getDefaultForm(todayStr));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-blue-500">{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Expense title" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option>Infrastructure</option>
                <option>Rent</option>
                <option>Salaries</option>
                <option>Software</option>
                <option>Travel</option>
                <option>Marketing</option>
                <option>Utilities</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount (₹) *</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Vendor</label>
              <input type="text" name="vendor" value={form.vendor} onChange={handleChange} placeholder="Vendor name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>UPI</option>
                <option>Auto-debit</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="text" name="date" value={form.date} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Receipt #</label>
              <input type="text" name="receiptNo" value={form.receiptNo} onChange={handleChange} placeholder="REF-001" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Recurring?</label>
              <select name="recurring" value={form.recurring} onChange={handleChange} className={inputClass}>
                <option>No</option>
                <option>Yes Monthly</option>
                <option>One-off</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional details" className={inputClass} />
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

const CATEGORY_STYLES = {
  Infrastructure: "bg-slate-100 text-slate-700",
  Rent: "bg-amber-100 text-amber-700",
  Salaries: "bg-emerald-100 text-emerald-700",
  Software: "bg-blue-100 text-blue-700",
  Travel: "bg-cyan-100 text-cyan-700",
  Marketing: "bg-pink-100 text-pink-700",
  Utilities: "bg-violet-100 text-violet-700",
};

const STATUS_STYLES = {
  Paid: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
};

const RECURRING_STYLES = {
  "Yes Monthly": "bg-teal-100 text-teal-700",
  "One-off": "bg-gray-100 text-black",
};

const INITIAL_EXPENSES = [
  { id: 1, title: "AWS Cloud Hosting", category: "Infrastructure", amount: "₹42,000", vendor: "Amazon Web Services", status: "Paid", method: "Credit Card", date: "2025-01-31", recurring: "Yes Monthly", receiptNo: "AWS-JAN-2025", notes: "Production servers" },
  { id: 2, title: "Office Rent - Feb", category: "Rent", amount: "₹85,000", vendor: "Prestige Properties", status: "Paid", method: "Bank Transfer", date: "2025-02-01", recurring: "Yes Monthly", receiptNo: "RENT FEB 2025", notes: "Hyderabad Office - 3rd Floor" },
  { id: 3, title: "Salaries - Feb 2025", category: "Salaries", amount: "₹6,80,000", vendor: "Payroll", status: "Paid", method: "Bank Transfer", date: "2025-02-28", recurring: "Yes Monthly", receiptNo: "PAY-FEB-2025", notes: "18 employees" },
  { id: 4, title: "Google Workspace", category: "Software", amount: "₹12,500", vendor: "Google", status: "Paid", method: "Credit Card", date: "2025-02-01", recurring: "Yes Monthly", receiptNo: "GOOG-FEB-2025", notes: "50 seats" },
  { id: 5, title: "Sales Conference Hyderabad", category: "Travel", amount: "₹35,000", vendor: "Multiple", status: "Paid", method: "Credit Card", date: "2025-02-15", recurring: "One-off", receiptNo: "TRAVEL-FEB-2025", notes: "Annual sales meetup" },
  { id: 6, title: "Marketing - LinkedIn Ads", category: "Marketing", amount: "₹28,000", vendor: "LinkedIn", status: "Paid", method: "Credit Card", date: "2025-02-20", recurring: "One-off", receiptNo: "LI-FEB-2025", notes: "Lead gen campaign Q1" },
  { id: 7, title: "Internet & Telecom", category: "Utilities", amount: "₹8,500", vendor: "Jio Business", status: "Paid", method: "Auto-debit", date: "2025-02-05", recurring: "Yes Monthly", receiptNo: "JIO-FEB-2025", notes: "-" },
];

const USER_PROFILE = {
  name: "Suresh Agarwal",
  role: "Finance Manager",
  email: "suresh.agarwal@company.com",
  initials: "SA",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = expenses.filter((row) => {
    const matchSearch =
      !search ||
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.vendor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All Categories" || row.category === categoryFilter;
    return matchSearch && matchCategory;
  });

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
      "Title",
      "Category",
      "Amount",
      "Vendor",
      "Status",
      "Method",
      "Date",
      "Recurring",
      "Receipt #",
      "Notes",
    ];
    const rows = filtered.map((row, idx) => [
      idx + 1,
      row.title,
      row.category,
      row.amount,
      row.vendor,
      row.status,
      row.method,
      row.date,
      row.recurring,
      row.receiptNo,
      row.notes,
    ]);
    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((r) => r.map(escapeCsv).join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Wallet className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Expenses</h1>
            <p className="text-[13px] text-black/70">Track and manage expenses, vendors, and cost categories.</p>
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
            onClick={() => { setEditingExpense(null); setShowAddExpenseModal(true); }}
            className="bg-blue-500 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Expense
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
                {USER_PROFILE.initials}
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {USER_PROFILE.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{USER_PROFILE.name}</p>
                      <p className="text-xs font-medium text-black/70">{USER_PROFILE.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{USER_PROFILE.email}</p>
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
                    onClick={() => (window.location.href = "/")}
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

      <AddExpenseModal
        open={showAddExpenseModal}
        onClose={() => { setShowAddExpenseModal(false); setEditingExpense(null); }}
        onSave={(exp, isEdit) => {
          if (isEdit) {
            setExpenses((prev) => prev.map((e) => (e.id === exp.id ? exp : e)));
          } else {
            setExpenses((prev) => [exp, ...prev]);
          }
        }}
        expense={editingExpense}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Stat cards – same style as HR DashboardOverview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Total Spent</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">₹9,42,200</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">All time</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 text-red-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Pending Payment</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">₹42,000</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">To pay</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Recurring Expenses</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">6</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Total Records</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">10</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Hash className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Expenses table – same card header style as HR DashboardOverview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-brand-soft/80 to-transparent flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
              <h2 className="text-sm font-semibold text-black">Expenses</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search title, vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-48"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Categories</option>
                <option>Infrastructure</option>
                <option>Rent</option>
                <option>Salaries</option>
                <option>Software</option>
                <option>Travel</option>
                <option>Marketing</option>
                <option>Utilities</option>
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
            <table className="w-max min-w-[900px] text-sm table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-[10rem]" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-[8rem]" />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-48" />
                <col className="w-16" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Title</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Category</th>
                  <th className="text-right py-3 px-3 font-semibold text-black">Amount</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Vendor</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Method</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Date</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Recurring</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Receipt #</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Notes</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-right text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.title}>{row.title}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[row.category] || "bg-gray-100 text-gray-700"}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-brand-dark tabular-nums whitespace-nowrap">{row.amount}</td>
                    <td className="py-3 px-3 text-body truncate" title={row.vendor}>{row.vendor}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.method}>{row.method}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${RECURRING_STYLES[row.recurring] || "bg-gray-100 text-gray-700"}`}>
                        {row.recurring}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.receiptNo}>{row.receiptNo}</td>
                    <td className="py-3 px-3 text-body truncate max-w-0" title={row.notes}>{row.notes}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => { setEditingExpense(row); setShowAddExpenseModal(true); }}
                        className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                        aria-label="Edit expense"
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
            <div className="py-12 text-center text-body text-sm">No expenses match your filters.</div>
          )}
        </div>
      </div>
    </>
  );
}
