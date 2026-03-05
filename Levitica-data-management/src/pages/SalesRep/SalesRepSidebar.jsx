import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Filter,
  Users,
  Target,
  Building2,
  ClipboardList,
  Phone,
  Mail,
  Folder,
  LogOut,
} from "lucide-react";

export default function SalesRepSidebar() {
  const navigate = useNavigate();
  const [roleLabel, setRoleLabel] = useState("Sales Rep");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("levitica_user_role");
      if (stored) setRoleLabel(stored);
    } catch (_) {}
  }, []);

  const handleSignOut = () => navigate("/");

  const navLinkClass = (isActive) =>
    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-blue-500 text-white font-bold" : "text-black font-semibold hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <aside
      className="fixed left-0 top-0 z-20 w-64 h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm overflow-hidden"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <div className="flex flex-col h-full min-h-0 p-4">
        <div className="shrink-0 px-2 py-4 mb-4 border-b border-gray-100">
          <NavLink to="/sales-rep" className="flex flex-row items-center w-full py-1 rounded-lg hover:bg-gray-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-inset">
            <img
              src="/assets/logo.png"
              alt="Levitica"
              className="h-20 w-auto max-w-[160px] object-contain shrink-0"
            />
            <div className="flex flex-col gap-0 min-w-0 ml-2.5">
              <span className="text-sm font-bold text-gray-900 truncate">Levitica</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{roleLabel}</span>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto min-h-0">
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider px-3 py-2">Overview</p>
          <NavLink to="/sales-rep" end>
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <LayoutDashboard className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Dashboard</span>
              </div>
            )}
          </NavLink>
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider px-3 py-2 mt-3">Sales CRM</p>
          <NavLink to="/sales-rep/leads">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Target className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">My Leads</span>
                <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">1</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales-rep/contacts">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Users className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">My Contacts</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales-rep/companies">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Building2 className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Companies</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales-rep/pipeline">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Filter className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">My Deals</span>
                <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">7</span>
              </div>
            )}
          </NavLink>
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider px-3 py-2 mt-3">Activity</p>
          <NavLink to="/sales-rep/activity">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <ClipboardList className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">Activity Log</span>
                <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">2</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales-rep/log-call">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Log a Call</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales-rep/email-log">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Mail className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Email Log</span>
              </div>
            )}
          </NavLink>
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider px-3 py-2 mt-3">Files</p>
          <NavLink to="/sales-rep/documents">
            {({ isActive }) => (
              <div className={navLinkClass(isActive)}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                <Folder className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Documents</span>
              </div>
            )}
          </NavLink>
        </nav>

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
