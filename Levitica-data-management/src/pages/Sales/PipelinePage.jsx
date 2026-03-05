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
  Briefcase,
  TrendingUp,
  Wallet,
  XCircle,
  Percent,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const STAGE_UI_TO_BACKEND = {
  Lead: "lead",
  Contacted: "contacted",
  Qualified: "qualified",
  "Meeting/Demo": "meeting",
  Negotiation: "negotiation",
  "Proposal Sent": "proposal",
  Won: "won",
  Lost: "lost",
};
const STAGE_BACKEND_TO_UI = {
  lead: "Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  meeting: "Meeting/Demo",
  proposal: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

function mapDealToRow(deal, ownerList = []) {
  let owner = deal.owner && typeof deal.owner === "object" ? deal.owner : null;
  if (!owner && deal.owner && ownerList.length) {
    const id = typeof deal.owner === "string" ? deal.owner : deal.owner?.toString?.();
    const u = ownerList.find((o) => (o.id || o._id) === id);
    if (u) owner = { _id: u._id || u.id, name: u.name };
  }
  const stageUi = STAGE_BACKEND_TO_UI[deal.stage] || deal.stage || "Lead";
  const amount = deal.amount != null ? deal.amount : 0;
  const value = amount === 0 ? "₹0" : `₹${Number(amount).toLocaleString("en-IN")}`;
  return {
    id: deal._id,
    ownerId: owner ? (owner._id || owner.id) : (deal.owner && typeof deal.owner === "string" ? deal.owner : null),
    title: deal.title || "—",
    subtext: deal.city || "—",
    company: deal.company || "—",
    value,
    stage: stageUi,
    probability: deal.prob != null ? deal.prob : 10,
    product: deal.product || "—",
    owner: owner ? owner.name : "—",
    ownerInitials: getInitials(owner ? owner.name : ""),
    closeDate: deal.closeDate ? new Date(deal.closeDate).toISOString().slice(0, 10) : "—",
    followUp: deal.followup ? new Date(deal.followup).toISOString().slice(0, 10) : "—",
    lastActivity: deal.lastAct ? new Date(deal.lastAct).toISOString().slice(0, 10) : "—",
  };
}

const STAGES = ["Lead", "Contacted", "Qualified", "Meeting/Demo", "Negotiation", "Proposal Sent", "Won", "Lost"];
const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "LinkedIn", "Event/Trade Show", "Partner"];
const INDUSTRIES = ["Technology", "Consulting", "Retail", "Healthcare", "Education", "Finance", "Other"];

const STAGE_STYLES = {
  Won: "bg-emerald-100 text-emerald-700",
  Lost: "bg-red-100 text-red-700",
  "Proposal Sent": "bg-amber-100 text-amber-700",
  Negotiation: "bg-blue-100 text-blue-700",
  "Meeting/Demo": "bg-amber-100 text-amber-700",
  Qualified: "bg-violet-100 text-violet-700",
  Lead: "bg-gray-100 text-gray-700",
  Contacted: "bg-blue-100 text-blue-700",
};

const initialDealForm = {
  dealTitle: "",
  company: "",
  dealValue: "0",
  stage: "Lead",
  probability: "10",
  productService: "",
  assignedTo: "",
  leadSource: "Website",
  expectedCloseDate: "",
  followUpDate: "",
  industry: "Technology",
  city: "",
  notes: "",
};

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

export default function PipelinePage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Rep", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Rep", email: "", initials: "—" };
  const currentUserId = storedUser && (storedUser._id || storedUser.id);

  const [deals, setDeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dealForm, setDealForm] = useState(initialDealForm);
  const [editingDeal, setEditingDeal] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isRep = storedUser && storedUser.role === "Sales Rep";
  const canDelete = storedUser && storedUser.role === "Admin";

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to view the pipeline.");
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
        const dealsRes = await apiRequest("/api/v1/deals?page=1&limit=200");
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
        setDeals((dealsRes.deals || []).map((d) => mapDealToRow(d, userList)));
        setUsers(userList);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load deals");
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

  const filtered = deals.filter((row) => {
    const matchSearch = !search || (row.title || "").toLowerCase().includes(search.toLowerCase()) || (row.company || "").toLowerCase().includes(search.toLowerCase()) || (row.product || "").toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "All Stages" || row.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const parseValue = (v) => parseInt(String(v || "0").replace(/[₹,\s]/g, ""), 10) || 0;
  const wonDeals = deals.filter((d) => d.stage === "Won");
  const lostDeals = deals.filter((d) => d.stage === "Lost");
  const pipelineDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const wonRevenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
  const pipelineValue = pipelineDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
  const totalValue = wonRevenue + pipelineValue;
  const avgDealValue = deals.length ? Math.round(totalValue / deals.length) : 0;
  const winRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;
  const formatCurrency = (n) => "₹" + n.toLocaleString("en-IN");

  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd || !/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return yyyyMmDd || "";
    const [y, m, d] = yyyyMmDd.split("-");
    return `${d}-${m}-${y}`;
  };
  const toYyyyMmDd = (ddMmYyyy) => {
    if (!ddMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(ddMmYyyy)) return ddMmYyyy || "";
    const [d, m, y] = ddMmYyyy.split("-");
    return `${y}-${m}-${d}`;
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    try {
      await apiRequest(`/api/v1/deals/${id}`, { method: "DELETE" });
      setDeals((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deal deleted");
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to delete deal");
    }
  };

  const openEditDeal = (row) => {
    setDealForm({
      dealTitle: row.title === "—" ? "" : row.title,
      company: row.company === "—" ? "" : row.company,
      dealValue: (row.value || "").replace(/[₹,\s]/g, "") || "0",
      stage: row.stage || "Lead",
      probability: String(row.probability ?? 10),
      productService: row.product === "—" ? "" : row.product,
      assignedTo: row.ownerId || (users[0] && (users[0].id || users[0]._id)) || currentUserId || "",
      leadSource: "Website",
      expectedCloseDate: row.closeDate && row.closeDate !== "—" ? toDdMmYyyy(row.closeDate) : "",
      followUpDate: row.followUp && row.followUp !== "—" ? toDdMmYyyy(row.followUp) : "",
      industry: "Technology",
      city: row.subtext === "—" ? "" : row.subtext,
      notes: "",
    });
    setEditingDeal(row);
    setAddModalOpen(true);
  };

  const handleDealFormChange = (field, value) => {
    setDealForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDeal = async () => {
    const { dealTitle, company, dealValue, stage, probability, productService, assignedTo, leadSource, expectedCloseDate, followUpDate, city, industry, notes } = dealForm;
    if (!dealTitle.trim() || !company.trim()) {
      toast.error("Deal title and company are required");
      return;
    }
    const ownerId = isRep ? currentUserId : (assignedTo || currentUserId);
    if (!ownerId && !editingDeal) {
      toast.error("Please assign an owner.");
      return;
    }
    const amount = parseInt(String(dealValue).replace(/[₹,\s]/g, ""), 10) || 0;
    const stageBackend = STAGE_UI_TO_BACKEND[stage] || "lead";
    const closeDate = toYyyyMmDd(expectedCloseDate) || new Date().toISOString().slice(0, 10);
    const followUp = toYyyyMmDd(followUpDate) || closeDate;
    const payload = {
      title: dealTitle.trim(),
      company: company.trim(),
      amount,
      stage: stageBackend,
      prob: parseInt(probability, 10) || 10,
      product: productService.trim() || undefined,
      owner: ownerId,
      source: leadSource,
      industry: industry || undefined,
      city: city.trim() || undefined,
      closeDate: closeDate || undefined,
      followup: followUp || undefined,
      notes: notes.trim() || undefined,
    };
    try {
      if (editingDeal) {
        const res = await apiRequest(`/api/v1/deals/${editingDeal.id}`, { method: "PUT", body: payload });
        const updated = mapDealToRow({ ...res.deal, _id: res.deal._id, owner: res.deal.owner }, users);
        setDeals((prev) => prev.map((d) => (d.id === editingDeal.id ? updated : d)));
        toast.success("Deal updated successfully");
      } else {
        const res = await apiRequest("/api/v1/deals", { method: "POST", body: payload });
        const created = mapDealToRow({ ...res.deal, _id: res.deal._id, owner: res.deal.owner }, users);
        setDeals((prev) => [created, ...prev]);
        toast.success("Deal added successfully");
      }
      setDealForm(initialDealForm);
      setEditingDeal(null);
      setAddModalOpen(false);
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error(err.message || "Failed to save deal");
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setDealForm(initialDealForm);
    setEditingDeal(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Briefcase className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Sales Pipeline</h1>
            <p className="text-[13px] text-black/70">Deals, stages, and CRM pipeline view.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input type="search" placeholder="Search anything..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm" />
          <button type="button" className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition" aria-label="Notifications"><Bell className="w-5 h-5" strokeWidth={2} /></button>
          <button type="button" onClick={() => { setEditingDeal(null); setDealForm({ ...initialDealForm, assignedTo: isRep ? (currentUserId || "") : (users[0] && (users[0]._id || users[0].id)) || currentUserId || "" }); setAddModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Deal
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Deals</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{deals.length}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Briefcase className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{formatCurrency(pipelineValue)}</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Value</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform"><TrendingUp className="w-6 h-6 text-emerald-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Won Revenue</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{formatCurrency(wonRevenue)}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Won</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Wallet className="w-6 h-6 text-teal-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Lost</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{lostDeals.length}</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform"><XCircle className="w-6 h-6 text-red-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Win Rate</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{winRate}%</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Rate</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Percent className="w-6 h-6 text-amber-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Avg Deal Value</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{formatCurrency(avgDealValue)}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Average</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><BarChart3 className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2"><Briefcase className="w-5 h-5 text-brand" strokeWidth={2} /> Sales Pipeline</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input type="search" placeholder="Search title, company, product..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52" />
              <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8">
                <option>All Stages</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-body text-sm">Loading deals…</div>
          ) : (
            <React.Fragment>
              <div className="overflow-x-auto">
                <table className="w-max min-w-[1000px] text-sm table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Deal Title</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Location</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                      <th className="text-right py-3 px-3 font-semibold text-black">Value</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Stage</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Probability</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Product</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Owner</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Close Date</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Follow-up</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Last Activity</th>
                      <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                        <td className="py-3 px-3 text-right tabular-nums">{idx + 1}</td>
                        <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.title}>{row.title}</td>
                        <td className="py-3 px-3 truncate" title={row.subtext}>{row.subtext}</td>
                        <td className="py-3 px-3 truncate" title={row.company}>{row.company}</td>
                        <td className="py-3 px-3 text-right font-medium tabular-nums whitespace-nowrap">{row.value}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_STYLES[row.stage] || "bg-gray-100 text-gray-700"}`}>{row.stage}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div className={`h-full rounded-full ${row.probability >= 50 ? "bg-emerald-500" : "bg-red-400"}`} style={{ width: `${row.probability}%` }} />
                            </div>
                            <span className="text-xs font-medium tabular-nums">{row.probability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 truncate" title={row.product}>{row.product}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">{row.ownerInitials}</span>
                            <span className="text-black truncate min-w-0" title={row.owner}>{row.owner}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 tabular-nums whitespace-nowrap">{row.closeDate}</td>
                        <td className="py-3 px-3 tabular-nums whitespace-nowrap">{row.followUp}</td>
                        <td className="py-3 px-3 tabular-nums whitespace-nowrap">{row.lastActivity}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => openEditDeal(row)} className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition" aria-label="Edit deal"><Pencil className="w-4 h-4" strokeWidth={2} /></button>
                            {canDelete && (
                              <button type="button" onClick={() => handleDelete(row.id)} className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition" aria-label="Delete deal"><Trash2 className="w-4 h-4" strokeWidth={2} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && <div className="py-12 text-center text-body text-sm">No deals match your filters.</div>}
            </React.Fragment>
          )}
        </div>
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingDeal ? "Edit Deal" : "Add Deal"}</h2>
              <button type="button" onClick={closeAddModal} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close"><X className="w-5 h-5" strokeWidth={2} /></button>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Deal title *</label>
                  <input type="text" value={dealForm.dealTitle} onChange={(e) => handleDealFormChange("dealTitle", e.target.value)} placeholder="Deal title" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Company *</label>
                  <input type="text" value={dealForm.company} onChange={(e) => handleDealFormChange("company", e.target.value)} placeholder="Company name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Deal value (₹)</label>
                  <input type="text" value={dealForm.dealValue} onChange={(e) => handleDealFormChange("dealValue", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stage</label>
                  <select value={dealForm.stage} onChange={(e) => handleDealFormChange("stage", e.target.value)} className={inputClass}>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Probability (%)</label>
                  <input type="text" value={dealForm.probability} onChange={(e) => handleDealFormChange("probability", e.target.value)} placeholder="10" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Product / Service</label>
                  <input type="text" value={dealForm.productService} onChange={(e) => handleDealFormChange("productService", e.target.value)} placeholder="Product" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Lead source</label>
                  <select value={dealForm.leadSource} onChange={(e) => handleDealFormChange("leadSource", e.target.value)} className={inputClass}>
                    {LEAD_SOURCES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                {!isRep && users.length > 0 && (
                  <div>
                    <label className={labelClass}>Owner</label>
                    <select value={dealForm.assignedTo} onChange={(e) => handleDealFormChange("assignedTo", e.target.value)} className={inputClass}>
                      {users.map((u) => <option key={u.id || u._id} value={u.id || u._id}>{u.name || u.email}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className={labelClass}>Industry</label>
                  <select value={dealForm.industry} onChange={(e) => handleDealFormChange("industry", e.target.value)} className={inputClass}>
                    {INDUSTRIES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={dealForm.city} onChange={(e) => handleDealFormChange("city", e.target.value)} placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Expected close date (dd-mm-yyyy)</label>
                  <input type="text" value={dealForm.expectedCloseDate} onChange={(e) => handleDealFormChange("expectedCloseDate", e.target.value)} placeholder="dd-mm-yyyy" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Follow-up date (dd-mm-yyyy)</label>
                  <input type="text" value={dealForm.followUpDate} onChange={(e) => handleDealFormChange("followUpDate", e.target.value)} placeholder="dd-mm-yyyy" className={inputClass} />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClass}>Notes</label>
                <textarea value={dealForm.notes} onChange={(e) => handleDealFormChange("notes", e.target.value)} rows={2} placeholder="Notes" className={inputClass + " w-full resize-y"} />
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button type="button" onClick={closeAddModal} className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition">Cancel</button>
                <button type="button" onClick={handleSaveDeal} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"><Save className="w-4 h-4" strokeWidth={2} /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
