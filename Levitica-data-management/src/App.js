import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Login";
import HRDashboard from "./pages/HRDashboard";
import DashboardOverview from "./pages/HR/DashboardOverview";
import MyCandidates from "./pages/HR/MyCandidates";
import OfferLetterGenerator from "./pages/HR/OfferLetterGenerator";
import FinanceDashboard from "./pages/FinanceDashboard";
import FinanceOverview from "./pages/Finance/FinanceOverview";
import InvoicesPage from "./pages/Finance/InvoicesPage";
import ExpensesPage from "./pages/Finance/ExpensesPage";
import PaymentsPage from "./pages/Finance/PaymentsPage";
import PLReportPage from "./pages/Finance/PLReportPage";
import SalesDashboard from "./pages/SalesDashboard";
import SalesOverview from "./pages/Sales/SalesOverview";
import PipelinePage from "./pages/Sales/PipelinePage";
import ContactsPage from "./pages/Sales/ContactsPage";
import LeadsPage from "./pages/Sales/LeadsPage";
import CompaniesPage from "./pages/Sales/CompaniesPage";
import ActivityLogPage from "./pages/Sales/ActivityLogPage";
import LogCallPage from "./pages/Sales/LogCallPage";
import EmailLogPage from "./pages/Sales/EmailLogPage";
import DocumentsPage from "./pages/Sales/DocumentsPage";
import BulkUploadPage from "./pages/Sales/BulkUploadPage";
import ReportsPage from "./pages/Sales/ReportsPage";
import SalesRepDashboard from "./pages/SalesRep/SalesRepDashboard";
import SalesRepOverview from "./pages/SalesRep/SalesOverview";
import SalesRepPipelinePage from "./pages/SalesRep/PipelinePage";
import SalesRepContactsPage from "./pages/SalesRep/ContactsPage";
import SalesRepLeadsPage from "./pages/SalesRep/LeadsPage";
import SalesRepCompaniesPage from "./pages/SalesRep/CompaniesPage";
import SalesRepActivityLogPage from "./pages/SalesRep/ActivityLogPage";
import SalesRepLogCallPage from "./pages/SalesRep/LogCallPage";
import SalesRepEmailLogPage from "./pages/SalesRep/EmailLogPage";
import SalesRepDocumentsPage from "./pages/SalesRep/DocumentsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/Admin/AdminOverview";
import AdminPlaceholder from "./pages/Admin/AdminPlaceholder";
import AdminLeadsPage from "./pages/Admin/AdminLeadsPage";
import AdminContactsPage from "./pages/Admin/AdminContactsPage";
import AdminCompaniesPage from "./pages/Admin/AdminCompaniesPage";
import AdminDealsPage from "./pages/Admin/AdminDealsPage";
import AdminActivityLogPage from "./pages/Admin/AdminActivityLogPage";
import AdminCallTrackingPage from "./pages/Admin/AdminCallTrackingPage";
import AdminEmailLogPage from "./pages/Admin/AdminEmailLogPage";
import AdminDocumentsPage from "./pages/Admin/AdminDocumentsPage";
import AdminBulkUploadPage from "./pages/Admin/AdminBulkUploadPage";
import AdminReportsPage from "./pages/Admin/AdminReportsPage";
import AdminUsersRolesPage from "./pages/Admin/AdminUsersRolesPage";
// Add User is now a modal on Users & Roles page (AdminUsersRolesPage)

function SalesPlaceholder({ title }) {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-brand-dark">{title}</h1>
      <p className="text-sm text-body mt-1">Coming soon.</p>
    </div>
  );
}

function FinancePlaceholder({ title }) {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-brand-dark">{title}</h1>
      <p className="text-sm text-body mt-1">Coming soon.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<HRDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="candidates" element={<MyCandidates />} />
          <Route path="offer-letter" element={<OfferLetterGenerator />} />
        </Route>
        <Route path="/finance" element={<FinanceDashboard />}>
          <Route index element={<FinanceOverview />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="pl-report" element={<PLReportPage />} />
        </Route>
        <Route path="/sales" element={<SalesDashboard />}>
          <Route index element={<SalesOverview />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="kanban" element={<Navigate to="/sales/pipeline" replace />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="activity" element={<ActivityLogPage />} />
          <Route path="log-call" element={<LogCallPage />} />
          <Route path="email-log" element={<EmailLogPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="bulk-upload" element={<BulkUploadPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="/sales-rep" element={<SalesRepDashboard />}>
          <Route index element={<SalesRepOverview />} />
          <Route path="pipeline" element={<SalesRepPipelinePage />} />
          <Route path="contacts" element={<SalesRepContactsPage />} />
          <Route path="leads" element={<SalesRepLeadsPage />} />
          <Route path="companies" element={<SalesRepCompaniesPage />} />
          <Route path="activity" element={<SalesRepActivityLogPage />} />
          <Route path="log-call" element={<SalesRepLogCallPage />} />
          <Route path="email-log" element={<SalesRepEmailLogPage />} />
          <Route path="documents" element={<SalesRepDocumentsPage />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="companies" element={<AdminCompaniesPage />} />
          <Route path="deals" element={<AdminDealsPage />} />
          <Route path="activity" element={<AdminActivityLogPage />} />
          <Route path="call-tracking" element={<AdminCallTrackingPage />} />
          <Route path="email-log" element={<AdminEmailLogPage />} />
          <Route path="documents" element={<AdminDocumentsPage />} />
          <Route path="bulk-upload" element={<AdminBulkUploadPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminUsersRolesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
