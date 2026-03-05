import React, { useState, useEffect } from "react";
import { X, Save, Calendar } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const formatINR = (n) => (n == null || isNaN(n) ? "0" : "₹" + Number(n).toLocaleString("en-IN"));
const parseINR = (str) => parseFloat(String(str ?? "").replace(/[₹,\s]/g, "")) || 0;
const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function AddDealModal({ open, onClose, onSave, deal: editingDeal }) {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    city: "",
    dealValue: "",
    stage: "Lead",
    probability: "30",
    owner: "Arjun Sharma",
    source: "",
    dealIndustry: "",
    followUpDate: "",
    expectedCloseDate: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    if (editingDeal) {
      setForm({
        companyName: editingDeal.company || "",
        contactPerson: editingDeal.contact || "",
        email: editingDeal.email || "",
        phone: "",
        industry: editingDeal.industry || "",
        city: editingDeal.location || "",
        dealValue: String(parseINR(editingDeal.dealValue)) || "",
        stage: editingDeal.stage || "Lead",
        probability: String(editingDeal.probability ?? 30),
        owner: editingDeal.owner || "Arjun Sharma",
        source: editingDeal.source || "",
        dealIndustry: editingDeal.industry || "",
        followUpDate: editingDeal.followUp || "",
        expectedCloseDate: editingDeal.expectedClose === "-" ? "" : (editingDeal.expectedClose || ""),
        notes: "",
      });
    } else {
      setForm({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        industry: "",
        city: "",
        dealValue: "",
        stage: "Lead",
        probability: "30",
        owner: "Arjun Sharma",
        source: "",
        dealIndustry: "",
        followUpDate: "",
        expectedCloseDate: "",
        notes: "",
      });
    }
  }, [open, editingDeal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.companyName?.trim()) return;
    const amountNum = parseFloat(String(form.dealValue).replace(/,/g, "")) || 0;
    const newDeal = {
      id: editingDeal?.id ?? Date.now(),
      company: form.companyName.trim(),
      location: form.city?.trim() || "-",
      contact: form.contactPerson?.trim() || "-",
      email: form.email?.trim() || "-",
      dealValue: formatINR(amountNum),
      stage: form.stage,
      probability: parseInt(form.probability, 10) || 0,
      owner: form.owner,
      ownerInitials: getInitials(form.owner),
      source: form.source || "-",
      industry: form.dealIndustry?.trim() || form.industry?.trim() || "-",
      followUp: form.followUpDate || "",
      expectedClose: form.expectedCloseDate || "-",
      lastActivity: editingDeal?.lastActivity || todayStr,
    };
    onSave(newDeal, !!editingDeal);
    setForm({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      industry: "",
      city: "",
      dealValue: "",
      stage: "Lead",
      probability: "30",
      owner: "Arjun Sharma",
      source: "",
      dealIndustry: "",
      followUpDate: "",
      expectedCloseDate: "",
      notes: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingDeal ? "Edit Deal" : "New Deal"}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Company &amp; Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company name" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Contact Person</label>
                <input type="text" name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Contact name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@company.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+910000000000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input type="text" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Deal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Deal Value (₹) *</label>
                <input type="number" name="dealValue" value={form.dealValue} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Stage</label>
                <select name="stage" value={form.stage} onChange={handleChange} className={inputClass}>
                  <option>Lead</option>
                  <option>Contacted</option>
                  <option>Demo</option>
                  <option>Proposal</option>
                  <option>Negotiation</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Probability (%)</label>
                <input type="number" name="probability" value={form.probability} onChange={handleChange} min="0" max="100" step="5" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Owner / Sales Rep</label>
                <select name="owner" value={form.owner} onChange={handleChange} className={inputClass}>
                  <option>Arjun Sharma</option>
                  <option>Vikram Joshi</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Source</label>
                <select name="source" value={form.source} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option>Referral</option>
                  <option>Cold Call</option>
                  <option>Website</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input type="text" name="dealIndustry" value={form.dealIndustry} onChange={handleChange} placeholder="Technology, Healthcare..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Follow-Up Date</label>
                <div className="relative">
                  <input type="text" name="followUpDate" value={form.followUpDate} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass + " pr-10"} />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Expected Close Date</label>
                <div className="relative">
                  <input type="text" name="expectedCloseDate" value={form.expectedCloseDate} onChange={handleChange} placeholder="dd-mm-yyyy" className={inputClass + " pr-10"} />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes" className={inputClass} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
