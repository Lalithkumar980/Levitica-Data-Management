import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Download,
  LayoutGrid,
  X,
  Save,
  Calendar,
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

// Backend uses lowercase stages; UI uses display labels
const STAGE_UI_TO_BACKEND = {
  Lead: "lead",
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

/** Map backend deal to table row. */
function mapDealToRow(deal, ownerList = []) {
  let owner = deal.owner && typeof deal.owner === "object" ? deal.owner : null;
  if (!owner && deal.owner && ownerList.length) {
    const id = typeof deal.owner === "string" ? deal.owner : deal.owner?.toString?.();
    owner = ownerList.find((u) => (u.id || u._id) === id) ? { _id: id, name: ownerList.find((u) => (u.id || u._id) === id).name } : null;
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

const STAGES = ["Lead", "Qualified", "Meeting/Demo", "Negotiation", "Proposal Sent", "Won", "Lost"];
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

export default function AdminDealsPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const adminUser = storedUser ? { name: storedUser.name || "Admin", role: storedUser.role || "Admin", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "Admin", role: "Admin", email: "", initials: "AD" };

  const [deals, setDeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [ownerFilter, setOwnerFilter] = useState("All Owners");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dealForm, setDealForm] = useState(initialDealForm);
  const [editingDeal, setEditingDeal] = useState(null);
  const [viewingDeal, setViewingDeal] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to manage deals.");
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
        const [dealsRes, usersRes] = await Promise.all([
          apiRequest("/api/v1/deals?page=1&limit=200"),
          apiRequest("/api/v1/admin/users").catch((e) => {
            if (e?.status === 401) throw e;
            return { users: [] };
          }),
        ]);
        if (cancelled) return;
        setDeals((dealsRes.deals || []).map((d) => mapDealToRow(d)));
        setUsers(usersRes.users || []);
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
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = deals.filter((row) => {
    const matchSearch =
      !search ||
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.product.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "All Stages" || row.stage === stageFilter;
    const matchOwner = ownerFilter === "All Owners" || row.owner === ownerFilter;
    return matchSearch && matchStage && matchOwner;
  });

  const wonDeals = deals.filter((d) => d.stage === "Won");
  const lostDeals = deals.filter((d) => d.stage === "Lost");
  const pipelineDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const parseValue = (v) => parseInt(String(v || "0").replace(/[₹,\s]/g, ""), 10) || 0;
  const wonRevenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
  const pipelineValue = pipelineDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
  const totalValue = wonRevenue + pipelineValue;
  const avgDealValue = deals.length ? Math.round(totalValue / deals.length) : 0;
  const winRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  const formatCurrency = (n) => "₹" + n.toLocaleString("en-IN");

  const handleExport = () => {
    const headers = ["#", "Deal Title", "Location", "Company", "Value", "Stage", "Probability (%)", "Product", "Owner", "Close Date", "Follow-up", "Last Activity"];
    const escape = (v) => {
      const s = v != null ? String(v) : "";
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filtered.map((row, idx) => [
      idx + 1,
      row.title,
      row.subtext ?? "",
      row.company,
      row.value ?? "",
      row.stage ?? "",
      row.probability ?? "",
      row.product ?? "",
      row.owner ?? "",
      row.closeDate ?? "",
      row.followUp ?? "",
      row.lastActivity ?? "",
    ]);
    const csv = ["\uFEFF" + headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `deals-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`Exported ${filtered.length} deal${filtered.length !== 1 ? "s" : ""}`);
  };

  const handleDelete = async (id) => {
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

  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd || !/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return yyyyMmDd || "";
    const [y, m, d] = yyyyMmDd.split("-");
    return `${d}-${m}-${y}`;
  };

  const openEditDeal = (row) => {
    setDealForm({
      dealTitle: row.title === "—" ? "" : row.title,
      company: row.company === "—" ? "" : row.company,
      dealValue: (row.value || "").replace(/[₹,\s]/g, "") || "0",
      stage: row.stage || "Lead",
      probability: String(row.probability ?? 10),
      productService: row.product === "—" ? "" : row.product,
      assignedTo: row.ownerId || (users[0] && (users[0].id || users[0]._id)) || "",
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

  const openViewDeal = (row) => setViewingDeal(row);

  const toYyyyMmDd = (ddMmYyyy) => {
    if (!ddMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(ddMmYyyy)) return ddMmYyyy || "";
    const [d, m, y] = ddMmYyyy.split("-");
    return `${y}-${m}-${d}`;
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
    const ownerId = assignedTo || (users[0] && (users[0].id || users[0]._id));
    if (!ownerId && !editingDeal) {
      toast.error("Please assign an owner (ensure users are loaded).");
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
            <h1 className="text-lg font-bold text-black leading-tight">Deals</h1>
            <p className="text-[13px] text-black/70">Track deals through the sales pipeline from lead to close.</p>
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
            onClick={() => { setEditingDeal(null); setDealForm(initialDealForm); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Deal
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{adminUser.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{adminUser.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{adminUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{adminUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{adminUser.email}</p>
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
        {/* Six KPI cards - same style as HR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Deals</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{deals.length}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{formatCurrency(pipelineValue)}</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Value</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6 text-emerald-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Won Revenue</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{formatCurrency(wonRevenue)}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Won</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Lost</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{lostDeals.length}</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <XCircle className="w-6 h-6 text-red-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Win Rate</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{winRate}%</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Rate</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Percent className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Avg Deal Value</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{formatCurrency(avgDealValue)}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Average</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Sales Pipeline table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand" strokeWidth={2} />
              Sales Pipeline
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search deals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
              />
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Stages</option>
                <option>Lead</option>
                <option>Qualified</option>
                <option>Meeting/Demo</option>
                <option>Negotiation</option>
                <option>Proposal Sent</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Owners</option>
                {users.map((u) => (
                  <option key={u.id || u._id} value={u.name || u.email || ""}>{u.name || u.email || u.id}</option>
                ))}
              </select>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                Kanban
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-body text-sm">Loading deals…</div>
          ) : (
          <React.Fragment>
          <div className="overflow-x-auto">
            <table className="w-max min-w-[1200px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Deal Title</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Value</th>
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
                    <td className="py-3 px-3 text-black tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="min-w-0">
                        <p className="font-medium text-brand-dark truncate" title={row.title}>{row.title}</p>
                        <p className="text-xs text-black truncate" title={row.subtext}>{row.subtext}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3 font-medium text-brand-dark tabular-nums">{row.value}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_STYLES[row.stage] || "bg-gray-100 text-gray-700"}`}>
                        {row.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden max-w-[60px]">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{ width: `${row.probability}%` }}
                          />
                        </div>
                        <span className="text-black text-xs font-medium tabular-nums">{row.probability}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.product}>{row.product}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.ownerInitials}
                        </span>
                        <span className="text-black truncate min-w-0" title={row.owner}>{row.owner}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-black tabular-nums whitespace-nowrap">{row.closeDate}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.followUp}>{row.followUp}</td>
                    <td className="py-3 px-3 text-black truncate" title={row.lastActivity}>{row.lastActivity}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditDeal(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit deal"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openViewDeal(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="View deal"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete deal"
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
            <div className="py-12 text-center text-body text-sm">No deals match your filters.</div>
          )}
          </React.Fragment>
          )}
        </div>
      </div>

      {/* New Deal Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingDeal ? "Edit Deal" : "New Deal"}</h2>
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
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Deal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Deal title *</label>
                  <input
                    type="text"
                    value={dealForm.dealTitle}
                    onChange={(e) => handleDealFormChange("dealTitle", e.target.value)}
                    placeholder="e.g. TechNova Enterprise License"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company *</label>
                  <input
                    type="text"
                    value={dealForm.company}
                    onChange={(e) => handleDealFormChange("company", e.target.value)}
                    placeholder="Company name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Deal value (₹) *</label>
                  <input
                    type="text"
                    value={dealForm.dealValue}
                    onChange={(e) => handleDealFormChange("dealValue", e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Stage</label>
                  <select
                    value={dealForm.stage}
                    onChange={(e) => handleDealFormChange("stage", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {STAGES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Probability (%)</label>
                  <input
                    type="text"
                    value={dealForm.probability}
                    onChange={(e) => handleDealFormChange("probability", e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Product / Service</label>
                  <input
                    type="text"
                    value={dealForm.productService}
                    onChange={(e) => handleDealFormChange("productService", e.target.value)}
                    placeholder="Product or service name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Owner</label>
                  <select
                    value={dealForm.assignedTo}
                    onChange={(e) => handleDealFormChange("assignedTo", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    <option value="">Select owner</option>
                    {users.map((u) => (
                      <option key={u.id || u._id} value={u.id || u._id}>{u.name || u.email || u.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Lead source</label>
                  <select
                    value={dealForm.leadSource}
                    onChange={(e) => handleDealFormChange("leadSource", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {LEAD_SOURCES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Expected close date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dealForm.expectedCloseDate}
                      onChange={(e) => handleDealFormChange("expectedCloseDate", e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Follow-up date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dealForm.followUpDate}
                      onChange={(e) => handleDealFormChange("followUpDate", e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Industry</label>
                  <select
                    value={dealForm.industry}
                    onChange={(e) => handleDealFormChange("industry", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {INDUSTRIES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    value={dealForm.city}
                    onChange={(e) => handleDealFormChange("city", e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes</label>
                  <textarea
                    value={dealForm.notes}
                    onChange={(e) => handleDealFormChange("notes", e.target.value)}
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
                className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDeal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingDeal ? "Save changes" : "Save Deal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Deal Modal */}
      {viewingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingDeal(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">View Deal</h2>
              <button type="button" onClick={() => setViewingDeal(null)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Deal Title</span><p className="font-medium text-brand-dark mt-0.5">{viewingDeal.title}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Company</span><p className="text-body mt-0.5">{viewingDeal.company}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Value</span><p className="text-body mt-0.5">{viewingDeal.value}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Stage</span><p className="text-body mt-0.5">{viewingDeal.stage}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Probability</span><p className="text-body mt-0.5">{viewingDeal.probability}%</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Product</span><p className="text-body mt-0.5">{viewingDeal.product}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Owner</span><p className="text-body mt-0.5">{viewingDeal.owner}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Close Date</span><p className="text-body mt-0.5">{viewingDeal.closeDate}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Follow-up</span><p className="text-body mt-0.5">{viewingDeal.followUp}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Last Activity</span><p className="text-body mt-0.5">{viewingDeal.lastActivity}</p></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
