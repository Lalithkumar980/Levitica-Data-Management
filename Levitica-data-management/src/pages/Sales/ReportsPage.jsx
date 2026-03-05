import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  Download,
  Wallet,
  TrendingUp,
  BarChart3,
  Percent,
  Activity,
  Phone,
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const escapeCsv = (v) => {
  const s = v != null ? String(v) : "";
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCsv = (filename, headers, rows) => {
  const csv = ["\uFEFF" + headers.map(escapeCsv).join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

const STAGE_LABELS = { lead: "Lead", contacted: "Contacted", qualified: "Qualified", meeting: "Meeting/Demo", proposal: "Proposal Sent", negotiation: "Negotiation", won: "Won", lost: "Lost" };
const BAR_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-blue-600", "bg-amber-500", "bg-emerald-600", "bg-gray-500"];

export default function ReportsPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Rep", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Rep", email: "", initials: "—" };

  const [dashboard, setDashboard] = useState(null);
  const [pipelineByStage, setPipelineByStage] = useState([]);
  const [leadsBySource, setLeadsBySource] = useState([]);
  const [repPerformance, setRepPerformance] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [activityBreakdown, setActivityBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to view reports.");
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
        const [dashRes, pipelineRes, sourceRes, repRes, forecastRes, activitiesRes] = await Promise.all([
          apiRequest("/api/v1/reports/dashboard"),
          apiRequest("/api/v1/reports/pipeline").catch(() => ({ pipeline: [] })),
          apiRequest("/api/v1/reports/leads-by-source").catch(() => ({ bySource: [] })),
          apiRequest("/api/v1/reports/rep-performance").catch(() => ({ reps: [] })),
          apiRequest("/api/v1/reports/forecast").catch(() => ({ forecast: 0, dealCount: 0 })),
          apiRequest("/api/v1/reports/activities").catch(() => ({ byType: [] })),
        ]);
        if (cancelled) return;
        setDashboard(dashRes);
        setPipelineByStage(Array.isArray(pipelineRes.pipeline) ? pipelineRes.pipeline : []);
        setLeadsBySource(Array.isArray(sourceRes.bySource) ? sourceRes.bySource : []);
        setRepPerformance((repRes.reps || []).map((r) => ({
          initials: getInitials(r.repName),
          name: r.repName || "—",
          totalDeals: r.dealsTotal ?? 0,
          won: r.wonCount ?? 0,
          wonValue: r.wonValue != null ? `₹${Number(r.wonValue).toLocaleString("en-IN")}` : "₹0",
          pipelineValue: r.pipelineValue != null ? `₹${Number(r.pipelineValue).toLocaleString("en-IN")}` : "₹0",
          winRate: `${r.winRate ?? 0}%`,
          callsLogged: r.callsLogged ?? 0,
          emailsLogged: r.emailsLogged ?? 0,
        })));
        setForecast(forecastRes);
        setActivityBreakdown(Array.isArray(activitiesRes.byType) ? activitiesRes.byType : []);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load reports");
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

  const maxLeads = Math.max(...leadsBySource.map((s) => s.count || 0), 1);

  const handleExportPipelineByStage = () => {
    const headers = ["Stage", "Count", "Value"];
    const rows = pipelineByStage.map((row) => [
      STAGE_LABELS[row.stage] || row.stage,
      row.count ?? 0,
      row.totalValue != null ? `₹${Number(row.totalValue).toLocaleString("en-IN")}` : "₹0",
    ]);
    downloadCsv(`pipeline-by-stage-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success("Pipeline by Stage exported");
  };

  const handleExportRepPerformance = () => {
    const headers = ["Rep", "Total Deals", "Won", "Won Value", "Pipeline Value", "Win Rate", "Calls", "Emails"];
    const rows = repPerformance.map((row) => [
      row.name,
      row.totalDeals,
      row.won,
      row.wonValue,
      row.pipelineValue,
      row.winRate,
      row.callsLogged,
      row.emailsLogged,
    ]);
    downloadCsv(`rep-performance-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success("Rep Performance exported");
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden><BarChart3 className="w-5 h-5" strokeWidth={2} /></span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Reports</h1>
            <p className="text-[13px] text-black/70">Pipeline, rep performance, and sales analytics at a glance.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input type="search" placeholder="Search anything..." className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          <button type="button" className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition" aria-label="Notifications"><Bell className="w-5 h-5" strokeWidth={2} /></button>
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
        {loading ? (
          <div className="flex items-center justify-center py-16 text-body">Loading reports…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Total Revenue Won</p>
                    <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">₹{(dashboard?.wonRevenue ?? 0).toLocaleString("en-IN")}</p>
                    <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Revenue</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Wallet className="w-6 h-6 text-emerald-700" strokeWidth={2} /></span>
                </div>
              </div>
              <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                    <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">₹{(dashboard?.pipelineValue ?? 0).toLocaleString("en-IN")}</p>
                    <p className="text-xs font-medium text-blue-700/80 mt-1.5">Value</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><TrendingUp className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
                </div>
              </div>
              <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Weighted Forecast</p>
                    <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">₹{(forecast?.forecast ?? 0).toLocaleString("en-IN")}</p>
                    <p className="text-xs font-medium text-violet-700/80 mt-1.5">Forecast</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform"><BarChart3 className="w-6 h-6 text-violet-700" strokeWidth={2} /></span>
                </div>
              </div>
              <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Win Rate</p>
                    <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{dashboard?.winRate ?? 0}%</p>
                    <p className="text-xs font-medium text-amber-700/80 mt-1.5">Rate</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Percent className="w-6 h-6 text-amber-700" strokeWidth={2} /></span>
                </div>
              </div>
              <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Total Activities</p>
                    <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{dashboard?.activityCount ?? 0}</p>
                    <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Activity className="w-6 h-6 text-teal-700" strokeWidth={2} /></span>
                </div>
              </div>
              <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Total Calls</p>
                    <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{activityBreakdown.find((a) => a.type === "Call")?.count ?? 0}</p>
                    <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Phone className="w-6 h-6 text-red-700" strokeWidth={2} /></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-brand-dark">Pipeline by Stage</h2>
                  <button type="button" onClick={handleExportPipelineByStage} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"><Download className="w-4 h-4" strokeWidth={2} /> Export</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[320px] text-sm table-fixed">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-3 font-semibold text-black">Stage</th>
                        <th className="text-right py-3 px-3 font-semibold text-black">Count</th>
                        <th className="text-right py-3 px-3 font-semibold text-black">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pipelineByStage.map((row, idx) => (
                        <tr key={row.stage || idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                          <td className="py-3 px-3 font-medium text-brand-dark">{STAGE_LABELS[row.stage] || row.stage}</td>
                          <td className="py-3 px-3 text-right text-body tabular-nums">{row.count ?? 0}</td>
                          <td className="py-3 px-3 text-right font-medium text-body tabular-nums">{row.totalValue != null ? `₹${Number(row.totalValue).toLocaleString("en-IN")}` : "₹0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-brand-dark">Leads by Source</h2></div>
                <div className="p-5 space-y-4">
                  {leadsBySource.length === 0 ? (
                    <div className="py-4 text-center text-body text-sm">No leads by source.</div>
                  ) : (
                    leadsBySource.map((item, i) => (
                      <div key={item.source || i} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-body w-32 shrink-0">{item.source || "Unknown"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                            <div className={`h-full rounded-lg ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${((item.count || 0) / maxLeads) * 100}%` }} />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-body tabular-nums w-6 text-right">{item.count ?? 0}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {repPerformance.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-brand-dark">Rep Performance</h2>
                  <button type="button" onClick={handleExportRepPerformance} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"><Download className="w-4 h-4" strokeWidth={2} /> Export</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm table-fixed">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-3 font-semibold text-black">Rep</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Total Deals</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Won</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Won Value</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Pipeline Value</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Win Rate</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Calls</th>
                        <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Emails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repPerformance.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">{row.initials}</span>
                              <span className="font-medium text-brand-dark truncate min-w-0" title={row.name}>{row.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right text-body tabular-nums">{row.totalDeals}</td>
                          <td className="py-3 px-3 text-right text-body tabular-nums">{row.won}</td>
                          <td className="py-3 px-3 text-right font-medium text-body tabular-nums">{row.wonValue}</td>
                          <td className="py-3 px-3 text-right text-body tabular-nums">{row.pipelineValue}</td>
                          <td className="py-3 px-3 text-right font-medium text-body tabular-nums">{row.winRate}</td>
                          <td className="py-3 px-3 text-right text-body tabular-nums">{row.callsLogged}</td>
                          <td className="py-3 px-3 text-right text-body tabular-nums">{row.emailsLogged}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-brand-dark">Forecast Summary</h2></div>
                <div className="p-5 space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-brand-dark">Won Revenue</span>
                      <span className="text-body">₹{(dashboard?.wonRevenue ?? 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-brand-dark">Weighted Forecast</span>
                      <span className="text-body">₹{(forecast?.forecast ?? 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-brand-dark">Active Pipeline</span>
                      <span className="text-body">₹{(dashboard?.pipelineValue ?? 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-brand-dark">Activity Breakdown</h2></div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {activityBreakdown.length === 0 ? (
                      <li className="py-2 text-body text-sm">No activity data.</li>
                    ) : (
                      activityBreakdown.map((item, i) => (
                        <li key={item.type || i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-body">{item.type || "—"}</span>
                          <span className="font-semibold text-brand-dark tabular-nums">{item.count ?? 0}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
