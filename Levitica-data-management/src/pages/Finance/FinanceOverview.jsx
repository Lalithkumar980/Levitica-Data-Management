import React from "react";
import { Bell, Zap, User, Banknote, Trophy, Wallet, Receipt, TrendingUp, FileText } from "lucide-react";

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

export default function FinanceOverview() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">Dashboard</h1>
          <p className="text-sm text-body">/ Overview</p>
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
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Summary cards - soft gradient design with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Total Collected</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">₹22,24,300</p>
                <p className="text-xs text-gray-500 mt-1.5">All time</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Outstanding</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">₹7,78,800</p>
                <p className="text-xs text-gray-500 mt-1.5">Pending collections</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">₹9,42,200</p>
                <p className="text-xs text-gray-500 mt-1.5">All time</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Net P&L</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">₹12,82,100</p>
                <p className="text-xs text-gray-500 mt-1.5">Profit</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Invoices</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">10</p>
                <p className="text-xs text-gray-500 mt-1.5">To overdue</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50/80 to-transparent flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition">
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
                    <p className="font-medium text-brand-dark">{item.title}</p>
                    <p className="text-sm text-body mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-soft/80 to-transparent flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center">
                <Wallet className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Revenue Summary</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {REVENUE_ITEMS.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-body font-medium">{item.label}</span>
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
