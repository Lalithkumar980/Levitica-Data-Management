import React, { useState, useEffect } from "react";
import { Bell, Receipt, Plus, Download, Pencil, X, Save, Wallet, Hash, Calendar } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const formatINR = (n) => (n == null || isNaN(n) ? "0" : "₹" + Number(n).toLocaleString("en-IN"));
const parseINR = (str) => parseFloat(String(str ?? "").replace(/[₹,\s]/g, "")) || 0;

const getDefaultForm = (todayStr) => ({
  client: "",
  amount: "",
  date: todayStr,
  paymentMethod: "",
  referenceNo: "",
  invoiceRef: "INV-2025-001",
  notes: "",
});

function RecordPaymentModal({ open, onClose, onSave, payment: editingPayment }) {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

  const [form, setForm] = useState(getDefaultForm(todayStr));

  useEffect(() => {
    if (!open) return;
    if (editingPayment) {
      const amount = parseINR(editingPayment.amount);
      setForm({
        client: editingPayment.client,
        amount: amount > 0 ? String(amount) : "",
        date: editingPayment.date === "-" ? todayStr : editingPayment.date,
        paymentMethod: editingPayment.method === "-" ? "" : editingPayment.method,
        referenceNo: editingPayment.referenceNo === "-" ? "" : editingPayment.referenceNo,
        invoiceRef: editingPayment.invoiceRef === "-" ? "INV-2025-001" : editingPayment.invoiceRef,
        notes: editingPayment.notes === "-" ? "" : editingPayment.notes,
      });
    } else {
      setForm(getDefaultForm(todayStr));
    }
  }, [open, editingPayment, todayStr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client?.trim()) return;
    const amountNum = parseFloat(String(form.amount).replace(/,/g, "")) || 0;
    const payload = {
      id: editingPayment ? editingPayment.id : Date.now(),
      client: form.client.trim(),
      amount: formatINR(amountNum),
      date: form.date || todayStr,
      method: form.paymentMethod || "-",
      referenceNo: form.referenceNo?.trim() || "-",
      invoiceRef: form.invoiceRef?.trim() || "-",
      notes: form.notes?.trim() || "-",
    };
    onSave(payload, !!editingPayment);
    if (!editingPayment) setForm(getDefaultForm(todayStr));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingPayment ? "Edit Payment" : "Record Payment"}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Client *</label>
                <input type="text" name="client" value={form.client} onChange={handleChange} placeholder="Client or candidate name" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input type="text" name="date" value={form.date} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Reference / UTR #</label>
                <input type="text" name="referenceNo" value={form.referenceNo} onChange={handleChange} placeholder="Transaction reference" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes" className={inputClass} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Amount (₹) *</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClass} required />
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
                <label className={labelClass}>Invoice Reference</label>
                <input type="text" name="invoiceRef" value={form.invoiceRef} onChange={handleChange} placeholder="INV-2025-001" className={inputClass} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition">
              <Save className="w-4 h-4" strokeWidth={2} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const INITIAL_PAYMENTS = [
  { id: 1, client: "TechNova Pvt Ltd", amount: "₹10,03,000", date: "2025-01-28", method: "Bank Transfer", referenceNo: "NEFT/TN/202501280", invoiceRef: "Inv1", notes: "Full payment received" },
  { id: 2, client: "MediCore India", amount: "₹10,85,600", date: "2025-02-25", method: "UPI", referenceNo: "UPI-MC-20250225", invoiceRef: "Inv2", notes: "Training fee - Full Stack" },
  { id: 3, client: "Mohit Gupta", amount: "₹35,100", date: "2025-02-10", method: "Credit Card", referenceNo: "CC-MG-20250210", invoiceRef: "Inv5", notes: "First installment 50%" },
  { id: 4, client: "Ratul MaxGroup", amount: "₹29,500", date: "2025-02-06", method: "Bank Transfer", referenceNo: "NEFT-RM-20250206", invoiceRef: "Inv6", notes: "Onboarding fee" },
  { id: 5, client: "Lata Krishnan", amount: "₹29,500", date: "2025-02-05", method: "UPI", referenceNo: "UPI-LK-20250205", invoiceRef: "Inv6", notes: "Certification program" },
  { id: 6, client: "EduLearn Pvt Ltd", amount: "₹54,150", date: "2025-02-18", method: "Bank Transfer", referenceNo: "NEFT-EL-20250218", invoiceRef: "Inv8", notes: "Corporate training batch" },
  { id: 7, client: "Dev Mahajan & Co", amount: "₹14,000", date: "2025-01-20", method: "UPI", referenceNo: "UPI-DM-20250120", invoiceRef: "Inv3", notes: "Partial - training advance" },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const filtered = payments.filter(
    (row) =>
      !search ||
      row.client.toLowerCase().includes(search.toLowerCase()) ||
      row.referenceNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const escapeCsv = (val) => {
      const s = String(val ?? "").trim();
      if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const headers = ["S.no", "Client", "Amount", "Date", "Method", "Reference #", "Invoice Ref", "Notes"];
    const rows = filtered.map((row, idx) => [
      idx + 1,
      row.client,
      row.amount,
      row.date,
      row.method,
      row.referenceNo,
      row.invoiceRef,
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
    a.download = `payments-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">Payments Received</h1>
          <p className="text-sm text-body">/ Payment Ledger</p>
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
            onClick={() => { setEditingPayment(null); setShowRecordPaymentModal(true); }}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Record Payment
          </button>
        </div>
      </header>

      <RecordPaymentModal
        open={showRecordPaymentModal}
        onClose={() => { setShowRecordPaymentModal(false); setEditingPayment(null); }}
        onSave={(p, isEdit) => {
          if (isEdit) {
            setPayments((prev) => prev.map((i) => (i.id === p.id ? p : i)));
          } else {
            setPayments((prev) => [p, ...prev]);
          }
        }}
        payment={editingPayment}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Three summary cards - soft gradient design with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Total Received</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">₹22,50,850</p>
                <p className="text-xs text-gray-500 mt-1.5">All time</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Transactions</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">7</p>
                <p className="text-xs text-gray-500 mt-1.5">Total count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Hash className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">This Month</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">₹0</p>
                <p className="text-xs text-gray-500 mt-1.5">Current month</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Payment Ledger */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2 shrink-0">
              <Receipt className="w-5 h-5 text-brand" strokeWidth={2} />
              Payment Ledger
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="search"
                placeholder="Search client, reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
              />
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
            <table className="w-full min-w-[800px] text-sm table-fixed" style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "3rem" }} />
                <col style={{ width: "10rem" }} />
                <col style={{ width: "7rem" }} />
                <col style={{ width: "6.5rem" }} />
                <col style={{ width: "7rem" }} />
                <col style={{ width: "10rem" }} />
                <col style={{ width: "5rem" }} />
                <col style={{ width: "12rem" }} />
                <col style={{ width: "4rem" }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-3 font-semibold text-gray-600 text-right w-12">S.no</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-left">Client</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-right">Amount</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-center">Date</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-left">Method</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-left">Reference #</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-left">Invoice Ref</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-left">Notes</th>
                  <th className="py-3 px-3 font-semibold text-gray-600 text-center w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-3 text-right text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark overflow-hidden">
                      <span className="block truncate" title={row.client}>{row.client}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-success tabular-nums whitespace-nowrap">{row.amount}</td>
                    <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 text-left text-body overflow-hidden">
                      <span className="block truncate" title={row.method}>{row.method}</span>
                    </td>
                    <td className="py-3 px-3 text-left text-body overflow-hidden">
                      <span className="block truncate" title={row.referenceNo}>{row.referenceNo}</span>
                    </td>
                    <td className="py-3 px-3 text-left text-body overflow-hidden">
                      <span className="block truncate" title={row.invoiceRef}>{row.invoiceRef}</span>
                    </td>
                    <td className="py-3 px-3 text-left text-body overflow-hidden">
                      <span className="block truncate" title={row.notes}>{row.notes}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => { setEditingPayment(row); setShowRecordPaymentModal(true); }}
                        className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                        aria-label="Edit payment"
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
            <div className="py-12 text-center text-body text-sm">No payments match your search.</div>
          )}
        </div>
      </div>
    </>
  );
}
