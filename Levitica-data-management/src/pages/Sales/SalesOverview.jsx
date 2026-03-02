import React from "react";
import {
  Bell,
  Phone,
  Mail,
  FileText,
  Calendar,
  Target,
  Activity,
  LayoutDashboard,
} from "lucide-react";

const RECENT_ACTIVITY = [
  { title: "Negotiation Call - Horizon", company: "Horizon Retail", user: "Vikram Joshi", date: "2025-02-10", icon: Phone },
  { title: "Product Demo - TechNova", company: "TechNova Pvt Ltd", user: "Vikram Joshi", date: "2025-01-18", icon: FileText },
  { title: "Proposal Follow-up Email", company: "TechNova Pvt Ltd", user: "Vikram Joshi", date: "2025-01-13", icon: Mail },
  { title: "Initial Discovery Call", company: "Horizon Retail", user: "Vikram Joshi", date: "2025-01-15", icon: Phone },
];

const PIPELINE_STAGES = [
  { label: "Lead", count: 3, color: "bg-blue-400" },
  { label: "Contacted", count: 3, color: "bg-blue-500" },
  { label: "Qualified", count: 3, color: "bg-brand" },
  { label: "Meeting/Demo", count: 3, color: "bg-violet-500" },
  { label: "Proposal Sent", count: 3, color: "bg-purple-500" },
  { label: "Negotiation", count: 1, color: "bg-amber-500" },
];

const LEADS_BY_SOURCE = [
  { label: "Referral", count: 1, color: "bg-blue-500" },
  { label: "Cold Call", count: 1, color: "bg-brand" },
];

const UPCOMING_FOLLOWUPS = [
  { type: "Call", date: "2025-02-28", title: "Horizon Retail", subtitle: null },
  { type: "Follow-up", date: "2025-03-15", title: "Check in with TechNova renewal", subtitle: "TechNova Pvt Ltd" },
];

export default function SalesOverview() {
  const maxPipeline = Math.max(...PIPELINE_STAGES.map((s) => s.count), 1);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Dashboard</h1>
            <p className="text-sm text-body leading-snug">Sales pipeline, activity, and follow-ups at a glance.</p>
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
        {/* Six metric cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">Total Leads</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">2</p>
                <p className="text-xs text-gray-500 mt-1.5">1 new</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Revenue Won</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">₹8,50,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Won</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">₹12,00,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Value</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Win Rate</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">50%</p>
                <p className="text-xs text-gray-500 mt-1.5">Rate</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">4</p>
                <p className="text-xs text-gray-500 mt-1.5">2 calls</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">2</p>
                <p className="text-xs text-gray-500 mt-1.5">2 pending total</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline by Stage & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center">
                <Target className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Pipeline by Stage</h2>
            </div>
            <div className="p-5 space-y-4">
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-body w-28 shrink-0">{stage.label}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${stage.color} transition-all`}
                        style={{ width: `${(stage.count / maxPipeline) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-body tabular-nums w-6 text-right shrink-0">
                    {stage.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_ACTIVITY.map((item, i) => {
                const Icon = item.icon;
                return (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition">
                  <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-dark">{item.title}</p>
                    <p className="text-sm text-body mt-0.5">
                      {item.company} · {item.user} · {item.date}
                    </p>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>

        {/* Leads by Source & Upcoming Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Leads by Source</h2>
            </div>
            <div className="p-5 space-y-4">
              {LEADS_BY_SOURCE.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-body w-24 shrink-0">{item.label}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${item.color}`}
                        style={{ width: `${item.count * 50}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-body tabular-nums w-6 text-right shrink-0">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Upcoming Follow-ups</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {UPCOMING_FOLLOWUPS.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition">
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-dark">{item.title}</p>
                    <p className="text-sm text-body mt-0.5">
                      {item.date}
                      {item.subtitle && ` · ${item.subtitle}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
