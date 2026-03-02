import React, { useState, useRef, useEffect } from "react";
import { Bell, Zap, User, Banknote, Trophy, Wallet, Receipt, TrendingUp, FileText, LayoutDashboard, LogOut } from "lucide-react";

const RECENT_ACTIVITY = [
  { type: "joined", title: "Rahul Sharma joined", subtitle: "CA Engineer · 2025-03-10", icon: "person" },
  { type: "joined", title: "Deepak Rao joined", subtitle: "HR Executive · 2025-03-01", icon: "person" },
  { type: "payment", title: "Payment received MediCore India", subtitle: "₹10,65,600 · 2025-02-25", icon: "payment" },
  { type: "deal", title: "Deal won: MediCore India", subtitle: "₹9,20,000 · 2025-02-20", icon: "trophy" },
  { type: "payment", title: "Payment received Dev Mah...", subtitle: "₹35,100 · 2025-02-10", icon: "payment" },
  { type: "payment", title: "Payment received Ratul MaxGroup", subtitle: "₹29,500 · 2025-02-06", icon: "payment" },
  { type: "payment", title: "Payment received Lata Krishnan", subtitle: "₹29,500 · 2025-02-05", icon: "payment" },
];

const REVENUE_ITEMS = [
  { label: "Company Invoices", value: "₹21,18,100", color: "text-success" },
  { label: "Training Fees", value: "₹1,06,200", color: "text-warning" },
  { label: "Pending Collections", value: "₹7,78,800", color: "text-warning" },
  { label: "Total Expenses", value: "₹9,42,200", color: "text-danger" },
  { label: "Net Profit", value: "₹12,82,100", color: "text-success" },
];

const USER_PROFILE = {
  name: "Suresh Agarwal",
  role: "Finance Manager",
  email: "suresh.agarwal@company.com",
  initials: "SA",
};

export default function FinanceOverview() {
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
            <p className="text-[13px] text-black/70">Revenue, expenses, and financial activity at a glance.</p>
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
                    onClick={() => (window.location.href = "/")}
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
        {/* Stat cards – same style as HR DashboardOverview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Total Collected</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">₹22,24,300</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">All time</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Outstanding</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">₹7,78,800</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Pending collections</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Receipt className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">₹9,42,200</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">All time</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 text-red-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Net P&L</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">₹12,82,100</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Profit</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Invoices</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">10</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">To overdue</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Two panels – same style as HR DashboardOverview */}
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
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.icon === "person"
                        ? "bg-brand-soft text-brand"
                        : item.icon === "trophy"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                    }`}
                    aria-hidden
                  >
                    {item.icon === "person" ? (
                      <User className="w-4 h-4" strokeWidth={2} />
                    ) : item.icon === "trophy" ? (
                      <Trophy className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <Banknote className="w-4 h-4" strokeWidth={2} />
                    )}
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
                <Wallet className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
              <h2 className="text-sm font-semibold text-black">Revenue Summary</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {REVENUE_ITEMS.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-body font-medium text-black">{item.label}</span>
                  <span className={`font-semibold tabular-nums ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
