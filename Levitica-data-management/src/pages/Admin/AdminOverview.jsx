import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  Briefcase,
  Percent,
  AlertCircle,
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const STAGE_LABELS = {
  lead: "Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  meeting: "Meeting/Demo",
  proposal: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};
const STAGE_COLORS = [
  "bg-blue-400", "bg-blue-500", "bg-brand", "bg-violet-500", "bg-purple-500", "bg-amber-500", "bg-emerald-500", "bg-red-400",
];

export default function AdminOverview() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const adminUser = storedUser ? { name: storedUser.name || "Admin", role: storedUser.role || "Admin", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "Admin", role: "Admin", email: "", initials: "AD" };

  const [dashboard, setDashboard] = useState(null);
  const [pipelineStages, setPipelineStages] = useState([]);
  const [leadsBySource, setLeadsBySource] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [repLeaderboard, setRepLeaderboard] = useState([]);
  const [upcomingFollowups, setUpcomingFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to view the dashboard.");
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
        const [dashRes, pipelineRes, sourceRes, activitiesRes, repRes, tasksRes] = await Promise.all([
          apiRequest("/api/v1/reports/dashboard"),
          apiRequest("/api/v1/reports/pipeline").catch(() => ({ pipeline: [] })),
          apiRequest("/api/v1/reports/leads-by-source").catch(() => ({ bySource: [] })),
          apiRequest("/api/v1/activities?page=1&limit=6").catch(() => ({ activities: [] })),
          apiRequest("/api/v1/reports/rep-performance").catch(() => ({ reps: [] })),
          apiRequest("/api/v1/tasks?page=1&limit=10&status=Pending").catch(() => ({ tasks: [] })),
        ]);
        if (cancelled) return;
        setDashboard(dashRes);
        setPipelineStages(Array.isArray(pipelineRes.pipeline) ? pipelineRes.pipeline : []);
        setLeadsBySource(Array.isArray(sourceRes.bySource) ? sourceRes.bySource : []);
        const acts = activitiesRes.activities || [];
        setRecentActivity(acts.map((a) => ({
          title: a.subject || "—",
          company: a.company || "—",
          user: (a.rep && a.rep.name) || "—",
          date: a.date ? new Date(a.date).toISOString().slice(0, 10) : "—",
          icon: a.type === "Email" ? Mail : a.type === "Meeting" ? FileText : Phone,
        })));
        const reps = repRes.reps || [];
        setRepLeaderboard(reps.map((r) => ({
          initials: getInitials(r.repName),
          name: r.repName || "—",
          dealsWon: r.wonCount ?? 0,
          revenue: r.wonValue != null ? `₹${Number(r.wonValue).toLocaleString("en-IN")}` : "₹0",
        })));
        const tasks = tasksRes.tasks || [];
        setUpcomingFollowups(tasks.slice(0, 8).map((t) => ({
          type: t.type || "Follow-up",
          date: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : "—",
          title: t.subject || "—",
          subtitle: t.company || null,
        })));
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load dashboard");
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

  const maxPipeline = Math.max(...pipelineStages.map((s) => s.count || 0), 1);
  const maxLeads = Math.max(...leadsBySource.map((s) => s.count || 0), 1);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Dashboard</h1>
            <p className="text-[13px] text-black/70">Track leads, pipeline, revenue, and activity at a glance.</p>
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
                {adminUser.initials}
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {adminUser.initials}
                    </div>
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
        {loading ? (
          <div className="flex items-center justify-center py-16 text-body">Loading dashboard…</div>
        ) : (
        <>
        {/* Six KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{dashboard?.totalLeads ?? 0}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Leads</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Revenue Won</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">₹{(dashboard?.wonRevenue ?? 0).toLocaleString("en-IN")}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Won</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Active Pipeline</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">₹{(dashboard?.pipelineValue ?? 0).toLocaleString("en-IN")}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Value</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Win Rate</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{dashboard?.winRate ?? 0}%</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Rate</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Percent className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">{dashboard?.activityCount ?? 0}</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Activities</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{dashboard?.overdueTasks ?? 0}</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">Overdue</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertCircle className="w-6 h-6 text-red-700" strokeWidth={2} />
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
              {pipelineStages.filter((s) => s.stage && s.stage !== "won" && s.stage !== "lost").map((stage, i) => (
                <div key={stage.stage || i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-body w-28 shrink-0">{STAGE_LABELS[stage.stage] || stage.stage}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-lg ${STAGE_COLORS[i % STAGE_COLORS.length]} transition-all`}
                        style={{ width: `${((stage.count || 0) / maxPipeline) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-body tabular-nums w-6 text-right shrink-0">
                    {stage.count ?? 0}
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
              {recentActivity.length === 0 ? (
                <div className="px-5 py-6 text-center text-body text-sm">No recent activity.</div>
              ) : (
                recentActivity.map((item, i) => {
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
                })
              )}
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
              {leadsBySource.length === 0 ? (
                <div className="py-4 text-center text-body text-sm">No leads by source.</div>
              ) : (
                leadsBySource.map((item, i) => (
                  <div key={item.source || i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-body w-32 shrink-0">{item.source || "Unknown"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="h-6 rounded-lg bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-lg ${STAGE_COLORS[i % STAGE_COLORS.length]}`}
                          style={{ width: `${((item.count || 0) / maxLeads) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-body tabular-nums w-6 text-right shrink-0">
                      {item.count ?? 0}
                    </span>
                  </div>
                ))
              )}
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
              {repLeaderboard.length === 0 ? (
                <div className="px-5 py-6 text-center text-body text-sm">No rep data.</div>
              ) : (
                repLeaderboard.map((item, i) => (
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
                ))
              )}
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
            {upcomingFollowups.length === 0 ? (
              <div className="w-full py-6 text-center text-body text-sm">No upcoming follow-ups.</div>
            ) : (
              upcomingFollowups.map((item, i) => (
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
              ))
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </>
  );
}
