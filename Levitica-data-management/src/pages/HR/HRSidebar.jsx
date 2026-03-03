import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default function HRSidebar() {
  const navigate = useNavigate();
  const [roleLabel, setRoleLabel] = useState("Enterprise");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("levitica_user_role");
      if (stored) setRoleLabel(stored);
    } catch (_) {}
  }, []);

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <aside
      className="fixed left-0 top-0 z-20 w-64 h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm overflow-hidden"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <div className="flex flex-col h-full min-h-0 p-4">
        {/* Company impression – logo and name in row */}
        <div className="shrink-0 px-2 py-4 mb-4 border-b border-gray-100">
          <NavLink to="/dashboard" className="flex flex-row items-center w-full py-1 rounded-lg hover:bg-gray-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-inset">
            <img
              src="/assets/logo.png"
              alt="Levitica"
              className="h-20 w-auto max-w-[160px] object-contain shrink-0"
            />
            <div className="flex flex-col gap-0 min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">Levitica</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{roleLabel}</span>
            </div>
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto min-h-0">
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider px-3 py-2">Overview</p>
          <NavLink to="/dashboard" end>
            {({ isActive }) => (
              <div
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200
                  ${isActive ? "bg-blue-500 text-white font-bold" : "text-black font-semibold hover:bg-blue-50 hover:text-blue-600"}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />
                )}
                <LayoutDashboard className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Dashboard</span>
              </div>
            )}
          </NavLink>
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider px-3 py-2 mt-3">HR</p>
          <NavLink to="/dashboard/candidates">
            {({ isActive }) => (
              <div
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200
                  ${isActive ? "bg-blue-500 text-white font-bold" : "text-black font-semibold hover:bg-blue-50 hover:text-blue-600"}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />
                )}
                <Users className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">My Candidates</span>
                <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-black font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={2} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
