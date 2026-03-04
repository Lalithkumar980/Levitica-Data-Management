import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  Upload,
  FileStack,
  ClipboardList,
  Clock,
} from "lucide-react";
import { getStoredUser, clearAuth } from "../../utils/api";

const SALES_USER = { name: "Vikram Joshi", role: "Sales Rep", email: "vikram.joshi@company.com", initials: "VJ" };

const CSV_COLUMNS = [
  { header: "first_name", field: "First Name", required: true, example: "Ratan" },
  { header: "last_name", field: "Last Name", required: true, example: "Mehta" },
  { header: "company", field: "Company", required: false, example: "TechNova Pvt Ltd" },
  { header: "phone", field: "Phone", required: true, example: "9876543216" },
  { header: "email", field: "Email", required: false, example: "rohan@technava.com" },
  { header: "industry", field: "Industry", required: false, example: "Technology" },
  { header: "city", field: "City", required: false, example: "Bangalore" },
  { header: "country", field: "Country", required: false, example: "India" },
  { header: "source", field: "Lead Source", required: true, example: "Cold Call" },
  { header: "notes", field: "Notes", required: false, example: "Met at conference" },
];

const IMPORT_HISTORY = [
  { file: "cold-call-list-feb.csv", uploadedBy: "Vikram Joshi", date: "2025-02-10", imported: 132, duplicatesSkipped: 13 },
  { file: "linkedin-export-jan.csv", uploadedBy: "Meena Reddy", date: "2025-01-24", imported: 84, duplicatesSkipped: 5 },
  { file: "event-leads-bangalore.csv", uploadedBy: "Vikram Joshi", date: "2025-01-15", imported: 56, duplicatesSkipped: 0 },
];

export default function BulkUploadPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser() || SALES_USER;
  const [profileOpen, setProfileOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e) => {
    const file = e.target?.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Upload className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Bulk Upload</h1>
            <p className="text-[13px] text-black/70">CSV / Excel import for leads. Columns auto-mapped; duplicates detected by email & phone.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
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
                {currentUser.initials || "—"}
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {currentUser.initials || "—"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{currentUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{currentUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left">
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    My Profile
                  </button>
                  <button type="button" onClick={() => { clearAuth(); navigate("/login"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left">
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
        {/* Bulk Lead Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0">
              <FileStack className="w-5 h-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-semibold text-black">Bulk Lead Upload (CSV / Excel)</h2>
              <p className="text-xs text-black/70 mt-0.5">Upload a CSV file with leads. Columns will be auto-mapped. Duplicates are detected by email & phone.</p>
            </div>
          </div>
          <div className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleBrowseClick}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 px-6 cursor-pointer transition ${
                dragOver ? "border-brand bg-brand-soft/50" : "border-gray-200 hover:border-brand hover:bg-brand-soft/30"
              }`}
            >
              <ClipboardList className="w-12 h-12 text-gray-400 mb-3" strokeWidth={2} />
              <p className="text-sm font-medium text-black mb-1">Drop CSV/Excel file here or click to browse</p>
              <p className="text-xs text-black/60">Accepted: .csv, .xlsx · Max 10,000 rows</p>
              {selectedFile && (
                <p className="mt-3 text-sm font-medium text-brand truncate max-w-xs" title={selectedFile.name}>
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Required CSV Column Format */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="text-red-500 font-bold">*</span>
            <h2 className="font-semibold text-black">Required CSV Column Format</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-black">Column header</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Field mapped to</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Required</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Example</th>
                </tr>
              </thead>
              <tbody>
                {CSV_COLUMNS.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-black">
                    <td className="py-3 px-3 font-medium text-black">{row.header}</td>
                    <td className="py-3 px-3 text-black">{row.field}</td>
                    <td className="py-3 px-3">
                      <span className={row.required ? "font-semibold text-emerald-600" : "text-black/70"}>{row.required ? "Required" : "Optional"}</span>
                    </td>
                    <td className="py-3 px-3 text-black">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-5 h-5" strokeWidth={2} />
            </span>
            <h2 className="font-semibold text-black">Import History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {IMPORT_HISTORY.map((item, idx) => (
              <div key={idx} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition">
                <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0">
                  <FileStack className="w-5 h-5" strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black truncate" title={item.file}>{item.file}</p>
                  <p className="text-xs text-black/60 mt-0.5">
                    Uploaded by {item.uploadedBy} on {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-emerald-600">{item.imported} Imported</span>
                  <span className="text-sm font-semibold text-red-600">{item.duplicatesSkipped} duplicates skipped</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
