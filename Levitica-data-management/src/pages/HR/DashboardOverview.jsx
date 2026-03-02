import React, { useState, useRef, useEffect } from "react";
import { Zap, User, Banknote, Users, Bell, FileCheck, Clock, UserCheck, LayoutDashboard, LogOut } from "lucide-react";

const RECENT_ACTIVITY = [
  { type: "joined", title: "Deepak Rao", subtitle: "HR Executive · 2025-03-01", icon: "person" },
  { type: "payment", title: "Payment received", subtitle: "MealCore India · ₹10,85,600 · 2025-02-28", icon: "payment" },
  { type: "payment", title: "Payment received", subtitle: "DevMahotre · ₹35,400 · 2025-02-27", icon: "payment" },
  { type: "payment", title: "Payment received", subtitle: "RetailMax Group · ₹29,500 · 2025-02-26", icon: "payment" },
  { type: "payment", title: "Payment received", subtitle: "Lata Krishnan · 2025-02-25", icon: "payment" },
  { type: "payment", title: "Payment received", subtitle: "TechNova Pvt Ltd · 2025-02-24", icon: "payment" },
  { type: "joined", title: "Rohan Mehta", subtitle: "Backend Developer · 2025-02-01", icon: "person" },
];

const PIPELINE_STAGES = [
  { label: "Screening", count: 3, width: "100%" },
  { label: "Technical", count: 3, width: "100%" },
  { label: "HR Round", count: 2, width: "67%" },
  { label: "Offer", count: 2, width: "67%" },
  { label: "Joined", count: 1, width: "33%" },
];

const USER_PROFILE = {
  name: "Priya Nair",
  role: "HR Recruiter",
  email: "priya.nair@company.com",
  initials: "PN",
};

export default function DashboardOverview() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Dashboard</h1>
            <p className="text-[13px] text-black/70">Overview of candidates, pipeline stages, and recent activity.</p>
          </div>
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
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {USER_PROFILE.initials}
              </div>
              
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {USER_PROFILE.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{USER_PROFILE.name}</p>
                      <p className="text-xs font-medium text-black/70">{USER_PROFILE.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{USER_PROFILE.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left"
                  >
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = "/"}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                  >
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
        {/* Four stat cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 font-semibold text-black">My Candidates</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">3</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Total in pipeline</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Offers Done</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">2</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Offers accepted</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Offers Pending</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">1</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Awaiting response</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Joined</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">1</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Onboarded</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Two content cards - improved UI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50/80 to-transparent flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
              <h2 className="text-sm font-semibold text-black">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="px-5 py-2.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.icon === "person" ? "bg-brand-soft text-brand" : "bg-emerald-50 text-emerald-600"}`} aria-hidden>
                    {item.icon === "person" ? <User className="w-4 h-4" strokeWidth={2} /> : <Banknote className="w-4 h-4" strokeWidth={2} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-black">{item.title}</p>
                    <p className="text-xs text-black/60 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-brand-soft/80 to-transparent flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
              <h2 className="text-sm font-semibold text-black">HR Pipeline Conversion</h2>
            </div>
            <div className="p-5 space-y-5">
              {PIPELINE_STAGES.map((stage, i) => {
                const colors = ["bg-brand", "bg-info", "bg-[#6d28d9]", "bg-success", "bg-amber-500"];
                const fill = colors[i % colors.length];
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-medium text-black">{stage.label}</span>
                      <span className="text-body font-semibold tabular-nums">({stage.count})</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${fill} transition-all duration-300`}
                        style={{ width: stage.width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
