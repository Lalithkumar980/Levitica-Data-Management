import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Filter,
  Users,
  Target,
  Building2,
  Briefcase,
  ClipboardList,
  Phone,
  Mail,
  Folder,
  LogOut,
} from "lucide-react";

export default function SalesSidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => navigate("/");

  const navClass = ({ isActive }) =>
    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive ? "bg-brand-soft text-brand-dark font-semibold" : "text-gray-600 hover:bg-gray-50"
    }`;
  const activeBar = (isActive) =>
    isActive ? (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r" />
    ) : null;

  return (
    <aside className="w-64 shrink-0 h-screen flex flex-col bg-white border-r border-gray-200/80 shadow-sm overflow-hidden">
      <div className="flex flex-col h-full min-h-0">
        <div className="shrink-0 p-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs shrink-0">
              LD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-dark truncate">Levitica</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Enterprise</p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="flex items-center gap-3 py-3 mb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
            VJ
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">Vikram Joshi</p>
            <p className="text-xs text-gray-500">Sales Rep</p>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mt-0.5" aria-hidden />
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-hidden">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Overview</p>
          <NavLink to="/sales" end>
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <LayoutDashboard className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Dashboard</span>
              </div>
            )}
          </NavLink>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-3">Sales CRM</p>
          <NavLink to="/sales/leads">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Target className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">My Leads</span>
                <span className="shrink-0 bg-danger text-white text-[10px] font-semibold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales/contacts">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Users className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">My Contacts</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales/companies">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Building2 className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Companies</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales/pipeline">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Filter className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">My Pipeline</span>
                <span className="shrink-0 bg-danger text-white text-[10px] font-semibold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
                  7
                </span>
              </div>
            )}
          </NavLink>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-3">Activity</p>
          <NavLink to="/sales/activity">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <ClipboardList className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm flex-1 min-w-0 truncate">Activity Log</span>
                <span className="shrink-0 bg-danger text-white text-[10px] font-semibold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales/log-call">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Log a Call</span>
              </div>
            )}
          </NavLink>
          <NavLink to="/sales/email-log">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Mail className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Email Log</span>
              </div>
            )}
          </NavLink>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-3">Files</p>
          <NavLink to="/sales/documents">
            {({ isActive }) => (
              <div className={navClass({ isActive })}>
                {activeBar(isActive)}
                <Folder className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="text-sm">Documents</span>
              </div>
            )}
          </NavLink>
        </nav>

        <div className="pt-3 mt-4 border-t border-gray-100">
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
      </div>
    </aside>
  );
}
