import React from "react";
import {
  Bell,
  LayoutDashboard,
  Phone,
  Mail,
  FileText,
  Calendar,
  Target,
  Activity,
  Trophy,
  Wallet,
  TrendingUp,
  Briefcase,
  Percent,
  AlertCircle,
} from "lucide-react";

const RECENT_ACTIVITY = [
  { title: "Proposal Sent - GreenPath", company: "GreenPath Solutions", user: "Meena Reddy", date: "2025-02-16", icon: FileText },
  { title: "Follow up GreenPath", company: "GreenPath Solutions", user: "Meena Reddy", date: "2025-02-15", icon: Phone },
  { title: "Negotiation Call - Horizon", company: "Horizon Retail Co", user: "Vikram Joshi", date: "2025-02-10", icon: Phone },
  { title: "Product Demo - TechNova", company: "TechNova Pvt Ltd", user: "Vikram Joshi", date: "2025-01-18", icon: FileText },
  { title: "Proposal Follow-up Email", company: "TechNova Pvt Ltd", user: "Vikram Joshi", date: "2025-01-18", icon: Mail },
  { title: "Initial Discovery Call", company: "TechNova Pvt Ltd", user: "Vikram Joshi", date: "2025-01-15", icon: Phone },
];

const PIPELINE_STAGES = [
  { label: "Lead", count: 1, color: "bg-blue-400" },
  { label: "Contacted", count: 1, color: "bg-blue-500" },
  { label: "Qualified", count: 1, color: "bg-brand" },
  { label: "Meeting/Demo", count: 1, color: "bg-violet-500" },
  { label: "Proposal Sent", count: 1, color: "bg-purple-500" },
  { label: "Negotiation", count: 1, color: "bg-amber-500" },
];

const LEADS_BY_SOURCE = [
  { label: "Cold Call", count: 2, color: "bg-blue-500" },
  { label: "LinkedIn", count: 2, color: "bg-brand" },
  { label: "Referral", count: 2, color: "bg-violet-500" },
  { label: "Website", count: 2, color: "bg-purple-500" },
  { label: "Event/Trade Show", count: 1, color: "bg-amber-500" },
  { label: "Partner", count: 1, color: "bg-emerald-500" },
];

const REP_LEADERBOARD = [
  { initials: "AK", name: "Aditya Kumar", dealsWon: 1, revenue: "₹9,20,000" },
  { initials: "VJ", name: "Vikram Joshi", dealsWon: 1, revenue: "₹8,56,000" },
  { initials: "MR", name: "Meena Reddy", dealsWon: 0, revenue: "₹0" },
  { initials: "KS", name: "Kavya Shah", dealsWon: 0, revenue: "₹0" },
];

const UPCOMING_FOLLOWUPS = [
  { type: "Call", date: "2025-02-28", title: "Follow-up call with Horizon Retail", subtitle: null },
  { type: "Email", date: "2025-03-01", title: "Send revised proposal to GreenPath", subtitle: null },
  { type: "Meeting", date: "2025-03-02", title: "Demo call - EduLeap", subtitle: null },
  { type: "Call", date: "2025-03-01", title: "Cold call batch - FinPlex", subtitle: null },
  { type: "Follow-up", date: "2025-03-15", title: "Check in with TechNova renewal", subtitle: null },
];

export default function AdminOverview() {
  const maxPipeline = Math.max(...PIPELINE_STAGES.map((s) => s.count), 1);
  const maxLeads = Math.max(...LEADS_BY_SOURCE.map((s) => s.count), 1);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Dashboard</h1>
            <p className="text-sm text-body leading-snug">Track leads, pipeline, revenue, and activity at a glance.</p>
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
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">Total Leads</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">8</p>
                <p className="text-xs text-gray-500 mt-1.5">3 new</p>
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
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">₹17,70,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Won</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">₹32,25,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Value</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-brand" strokeWidth={2} />
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
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">6</p>
                <p className="text-xs text-gray-500 mt-1.5">6 calls</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">5</p>
                <p className="text-xs text-gray-500 mt-1.5">5 pending total</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />
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

        {/* Leads by Source & Rep Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                  <span className="text-sm font-medium text-body w-32 shrink-0">{item.label}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${item.color}`}
                        style={{ width: `${(item.count / maxLeads) * 100}%` }}
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
              <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Rep Leaderboard</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {REP_LEADERBOARD.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
                  <div className="w-9 h-9 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-dark">{item.name}</p>
                    <p className="text-sm text-body">
                      {item.dealsWon} deals won · {item.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Follow-ups - full width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" strokeWidth={2} />
            </span>
            <h2 className="font-semibold text-brand-dark">Upcoming Follow-ups</h2>
          </div>
          <div className="p-5 flex flex-wrap gap-4">
            {UPCOMING_FOLLOWUPS.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand-soft/50 border border-gray-100 min-w-[240px] hover:bg-brand-soft/70 transition"
              >
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-body uppercase">
                    {item.type} {item.date}
                  </p>
                  <p className="font-medium text-brand-dark mt-0.5">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-sm text-body mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
