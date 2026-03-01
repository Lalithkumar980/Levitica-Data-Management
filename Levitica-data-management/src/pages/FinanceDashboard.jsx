import React from "react";
import { Outlet } from "react-router-dom";
import FinanceSidebar from "./Finance/FinanceSidebar";

export default function FinanceDashboard() {
  return (
    <div className="min-h-screen flex bg-[#F6F7FB]">
      <FinanceSidebar />
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden ml-64">
        <Outlet />
      </main>
    </div>
  );
}
