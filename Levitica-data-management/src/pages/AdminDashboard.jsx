import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Admin/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-[#F6F7FB]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden ml-64">
        <Outlet />
      </main>
    </div>
  );
}
