import React from "react";
import { Bell, Download, Wallet, TrendingUp, BarChart3, Percent, Activity, Phone } from "lucide-react";

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
  { initials: "VJ", name: "Vikram Joshi", totalDeals: 2, won: 1, wonValue: "₹8,56,060", pipelineValue: "₹12,00,000", winRate: "50%", callsLogged: 2, emailsLogged: 1 },
  { initials: "MR", name: "Meena Reddy", totalDeals: 2, won: 0, wonValue: "₹0", pipelineValue: "₹7,70,600", winRate: "0%", callsLogged: 1, emailsLogged: 1 },
  { initials: "AK", name: "Aditya Kumar", totalDeals: 2, won: 1, wonValue: "₹9,26,060", pipelineValue: "₹3,75,600", winRate: "50%", callsLogged: 0, emailsLogged: 0 },
  { initials: "KS", name: "Kavya Shah", totalDeals: 2, won: 0, wonValue: "₹0", pipelineValue: "₹8,80,000", winRate: "0%", callsLogged: 0, emailsLogged: 0 },
];

const FORECAST_VS_TARGET = [
  { label: "Won Revenue", current: "₹17,78,080", target: "₹20,03,038", percent: 89, color: "bg-success" },
  { label: "Weighted Forecast", current: "₹17,68,258", target: "₹15,03,038", percent: 100, color: "bg-violet-500" },
  { label: "Active Pipeline", current: "₹32,25,388", target: "₹58,03,800", percent: 56, color: "bg-amber-500" },
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

export default function AdminReportsPage() {
  const maxLeads = Math.max(...LEADS_BY_SOURCE.map((s) => s.count), 1);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <BarChart3 className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Reports</h1>
            <p className="text-sm text-body leading-snug">Pipeline, rep performance, and sales analytics at a glance.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search CRM..."
            className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
          />
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Six KPI cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider mb-1.5">Total Revenue Won</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">₹17,70,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Revenue</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">₹32,25,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Value</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Weighted Forecast</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">₹17,60,350</p>
                <p className="text-xs text-gray-500 mt-1.5">Forecast</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Win Rate</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">25%</p>
                <p className="text-xs text-gray-500 mt-1.5">Rate</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Percent className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">6</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">Total Calls</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">3</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pipeline by Stage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-brand-dark">Pipeline by Stage</h2>
              <button
                type="button"
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
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Stage</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-600">Count</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-600">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {PIPELINE_BY_STAGE.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3 font-medium text-brand-dark">{row.stage}</td>
                      <td className="py-3 px-3 text-right text-body tabular-nums">{row.count}</td>
                      <td className="py-3 px-3 text-right font-medium text-body tabular-nums">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leads by Source */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-brand-dark">Leads by Source</h2>
            </div>
            <div className="p-5 space-y-4">
              {LEADS_BY_SOURCE.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-body w-32 shrink-0">{item.label}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${item.color}`}
                        style={{ width: `${(item.count / maxLeads) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-body tabular-nums w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rep Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-brand-dark">Rep Performance</h2>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body hover:bg-gray-50 text-sm font-medium transition"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-max min-w-[800px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Rep</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Total Deals</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Won</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Won Value</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Pipeline Value</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Win Rate</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Calls</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600">Emails</th>
                </tr>
              </thead>
              <tbody>
                {REP_PERFORMANCE.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.initials}
                        </span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Forecast vs Target */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-brand-dark">Forecast vs Target</h2>
            </div>
            <div className="p-5 space-y-5">
              {FORECAST_VS_TARGET.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-brand-dark">{item.label}</span>
                    <span className="text-body">
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
              <h2 className="font-semibold text-brand-dark">Activity Breakdown</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {ACTIVITY_BREAKDOWN.map((item, i) => (
                  <li key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-body">{item.type}</span>
                    <span className="font-semibold text-brand-dark tabular-nums">{item.count}</span>
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
