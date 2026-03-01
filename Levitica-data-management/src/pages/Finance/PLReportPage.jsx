import React from "react";
import { Bell, BarChart3, Wallet, FileText, TrendingUp } from "lucide-react";

const REVENUE_ITEMS = [
  { label: "Company Invoices", value: "₹21,18,100", color: "text-success" },
  { label: "Training Fees", value: "₹1,06,200", color: "text-warning" },
  { label: "Pending Collections", value: "₹7,78,800", color: "text-warning" },
  { label: "Total Revenue", value: "₹22,24,300", color: "text-success font-semibold" },
];

const EXPENSE_ITEMS = [
  { label: "Salaries", amount: 604000, display: "₹6,04,000" },
  { label: "Rent", amount: 85000, display: "₹85,000" },
  { label: "Legal", amount: 45000, display: "₹45,000" },
  { label: "Infrastructure", amount: 42000, display: "₹42,000" },
  { label: "Travel", amount: 35200, display: "₹35,200" },
  { label: "Marketing", amount: 28800, display: "₹28,800" },
  { label: "Software", amount: 2500, display: "₹2,500" },
  { label: "Utilities", amount: 8500, display: "₹8,500" },
  { label: "Office", amount: 6280, display: "₹6,280" },
];

const MAX_EXPENSE = Math.max(...EXPENSE_ITEMS.map((e) => e.amount));

export default function PLReportPage() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">P&L Report</h1>
          <p className="text-sm text-body">/ Profit &amp; Loss Analysis</p>
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
        {/* Six top metric cards - soft gradient design with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Total Revenue</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">₹22,24,300</p>
                <p className="text-xs text-gray-500 mt-1.5">All time</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-teal-600" strokeWidth={2} />
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
                <FileText className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Net Profit / Loss</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">₹12,82,100</p>
                <p className="text-xs text-gray-500 mt-1.5">Profit</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Outstanding A/R</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">₹7,78,800</p>
                <p className="text-xs text-gray-500 mt-1.5">Receivables</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Sales Pipeline</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">₹17,70,000</p>
                <p className="text-xs text-gray-500 mt-1.5">Won</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Profit Margin</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">58%</p>
                <p className="text-xs text-gray-500 mt-1.5">Margin</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown & Expenses by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/80 to-transparent flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Revenue Breakdown</h2>
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50/80 to-transparent flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
              <h2 className="font-semibold text-brand-dark">Expenses by Category</h2>
            </div>
            <div className="p-5 space-y-4">
              {EXPENSE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-body w-24 shrink-0">{item.label}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-7 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-red-500 to-red-400 min-w-[2rem]"
                        style={{ width: `${(item.amount / MAX_EXPENSE) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-body tabular-nums w-20 text-right shrink-0">{item.display}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
