import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default function HRSidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-20 w-64 h-screen flex flex-col bg-white border-r border-gray-200/80 shadow-sm overflow-hidden">
      <div className="flex flex-col h-full min-h-0 p-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs shrink-0">
            LD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-dark truncate">Levitica</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Enterprise</p>
          </div>
        </div>

        {/* User block */}
        <div className="flex items-center gap-3 py-3 mb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-semibold text-xs shrink-0">
            PN
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">Priya Nair</p>
            <p className="text-xs text-gray-500">HR Recruiter</p>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mt-0.5" aria-hidden />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto min-h-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Overview</p>
          <NavLink to="/dashboard" end>
            {({ isActive }) => (
              <div
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive ? "bg-brand-soft text-brand-dark font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r" />
                )}
                <LayoutDashboard className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Dashboard</span>
              </div>
            )}
          </NavLink>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-3">HR</p>
          <NavLink to="/dashboard/candidates">
            {({ isActive }) => (
              <div
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive ? "bg-brand-soft text-brand-dark font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r" />
                )}
                <Users className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">My Candidates</span>
                <span className="shrink-0 bg-danger text-white text-[10px] font-semibold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
            )}
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="pt-3 mt-auto border-t border-gray-100">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-danger transition-colors text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={2} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
