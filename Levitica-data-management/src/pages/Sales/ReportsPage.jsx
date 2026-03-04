import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  User,
  LogOut,
  BarChart3,
  Download,
  Wallet,
  TrendingUp,
  Percent,
  Activity,
  Phone,
} from "lucide-react";
import { getStoredUser, clearAuth } from "../../utils/api";

const SALES_USER = { name: "Vikram Joshi", role: "Sales Rep", email: "vikram.joshi@company.com", initials: "VJ" };

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

const PIPELINE_BY_STAGE = [
  { stage: "Lead", count: 1, value: "₹6,06,068" },
  { stage: "Contacted", count: 1, value: "₹2,86,068" },
  { stage: "Qualified", count: 1, value: "₹4,56,060" },
  { stage: "Meeting/Demo", count: 1, value: "₹3,75,060" },
  { stage: "Proposal Sent", count: 1, value: "₹3,26,068" },
  { stage: "Negotiation", count: 1, value: "₹12,06,060" },
  { stage: "Won", count: 2, value: "₹17,76,068" },
  { stage: "Lost", count: 0, value: "₹0" },
];

const LEADS_BY_SOURCE = [
  { label: "Cold Call", count: 2, color: "bg-blue-500" },
  { label: "Referral", count: 1, color: "bg-emerald-500" },
  { label: "Website", count: 1, color: "bg-violet-500" },
  { label: "LinkedIn", count: 1, color: "bg-blue-600" },
  { label: "Event/Trade Show", count: 1, color: "bg-amber-500" },
  { label: "Partner", count: 1, color: "bg-emerald-600" },
  { label: "Advertisement", count: 1, color: "bg-gray-500" },
];

const REP_PERFORMANCE = [
  { initials: "VJ", name: "Vikram Joshi", totalDeals: 3, won: 1, wonValue: "₹8,50,000", pipelineValue: "₹12,00,000", winRate: "33%", callsLogged: 2, emailsLogged: 1 },
];

const FORECAST_VS_TARGET = [
  { label: "Won Revenue", current: "₹8,50,000", target: "₹15,00,000", percent: 57, color: "bg-emerald-500" },
  { label: "Weighted Forecast", current: "₹7,60,350", target: "₹12,00,000", percent: 63, color: "bg-violet-500" },
  { label: "Active Pipeline", current: "₹12,00,000", target: "₹25,00,000", percent: 48, color: "bg-amber-500" },
];

const ACTIVITY_BREAKDOWN = [
  { type: "Call", count: 3 },
  { type: "Email", count: 2 },
  { type: "Meeting", count: 1 },
  { type: "Demo", count: 0 },
  { type: "Follow up", count: 0 },
  { type: "Note", count: 0 },
  { type: "Task", count: 0 },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser() || SALES_USER;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const maxLeads = Math.max(...LEADS_BY_SOURCE.map((s) => s.count), 1);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleExportPipelineByStage = () => {
    const headers = ["Stage", "Count", "Value"];
    const rows = PIPELINE_BY_STAGE.map((row) => [row.stage, row.count, row.value]);
    downloadCsv(`pipeline-by-stage-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success("Pipeline by Stage exported");
  };

  const handleExportRepPerformance = () => {
    const headers = ["Rep", "Total Deals", "Won", "Won Value", "Pipeline Value", "Win Rate", "Calls", "Emails"];
    const rows = REP_PERFORMANCE.map((row) => [
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
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <BarChart3 className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Reports</h1>
            <p className="text-[13px] text-black/70">Analytics & dashboards for pipeline, rep performance, and activities.</p>
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
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {currentUser.initials || "—"}
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {currentUser.initials || "—"}
                    </div>
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
        {/* KPI cards – HR/Sales style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Total Revenue Won</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">₹8,50,000</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Revenue</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 text-emerald-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">₹12,00,000</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Value</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Weighted Forecast</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">₹7,60,350</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Forecast</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Win Rate</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">33%</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Rate</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Percent className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">6</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Total Calls</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">3</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-red-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pipeline by Stage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-black">Pipeline by Stage</h2>
              <button
                type="button"
                onClick={handleExportPipelineByStage}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-sm table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-black">Stage</th>
                    <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Count</th>
                    <th className="text-right py-3 px-3 font-semibold text-black tabular-nums">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {PIPELINE_BY_STAGE.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                      <td className="py-3 px-3 font-medium text-black">{row.stage}</td>
                      <td className="py-3 px-3 text-right text-black tabular-nums">{row.count}</td>
                      <td className="py-3 px-3 text-right font-medium text-black tabular-nums">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leads by Source */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-black">Leads by Source</h2>
            </div>
            <div className="p-5 space-y-4">
              {LEADS_BY_SOURCE.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-black w-32 shrink-0">{item.label}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${item.color}`}
                        style={{ width: `${(item.count / maxLeads) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-black tabular-nums w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rep Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-black">Rep Performance</h2>
            <button
              type="button"
              onClick={handleExportRepPerformance}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm table-fixed">
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>
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
                {REP_PERFORMANCE.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.initials}
                        </span>
                        <span className="font-medium text-black truncate min-w-0" title={row.name}>{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-black tabular-nums">{row.totalDeals}</td>
                    <td className="py-3 px-3 text-right text-black tabular-nums">{row.won}</td>
                    <td className="py-3 px-3 text-right font-medium text-black tabular-nums">{row.wonValue}</td>
                    <td className="py-3 px-3 text-right text-black tabular-nums">{row.pipelineValue}</td>
                    <td className="py-3 px-3 text-right font-medium text-black tabular-nums">{row.winRate}</td>
                    <td className="py-3 px-3 text-right text-black tabular-nums">{row.callsLogged}</td>
                    <td className="py-3 px-3 text-right text-black tabular-nums">{row.emailsLogged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Forecast vs Target */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-black">Forecast vs Target</h2>
            </div>
            <div className="p-5 space-y-5">
              {FORECAST_VS_TARGET.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-black">{item.label}</span>
                    <span className="text-black">
                      {item.current} / {item.target} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-black">Activity Breakdown</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {ACTIVITY_BREAKDOWN.map((item, i) => (
                  <li key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-black">{item.type}</span>
                    <span className="font-semibold text-black tabular-nums">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
