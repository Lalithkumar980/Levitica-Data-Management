import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  Bell,
  User,
  LogOut,
  Upload,
  FileStack,
  ClipboardList,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

const ACCEPTED_EXT = /\.(csv|xlsx?|xls)$/i;
function isAcceptedFile(file) {
  return file && file.name && ACCEPTED_EXT.test(file.name);
}

function excelToCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const firstSheet = wb.SheetNames[0] ? wb.Sheets[wb.SheetNames[0]] : null;
        if (!firstSheet) {
          reject(new Error("Excel file has no sheets"));
          return;
        }
        const csvStr = XLSX.utils.sheet_to_csv(firstSheet);
        const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8" });
        const csvFile = new File([blob], (file.name || "upload").replace(/\.[^.]+$/i, "") + ".csv", { type: "text/csv" });
        resolve(csvFile);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

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

export default function BulkUploadPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Manager", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Manager", email: "", initials: "—" };

  const [profileOpen, setProfileOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const profileRef = useRef(null);
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to upload leads.");
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await apiRequest("/api/v1/import/history");
        if (!cancelled) setImportHistory(res.history || []);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        if (err?.status === 403) {
          toast.error("You don't have permission to view import history.");
          if (!cancelled) setImportHistory([]);
        } else {
          toast.error(err.message || "Failed to load import history");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchHistory();
    return () => { cancelled = true; };
  }, [navigate]);

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
    if (isAcceptedFile(file)) {
      setSelectedFile(file);
    } else {
      toast.warn("Please drop a CSV or Excel file (.csv, .xls, .xlsx).");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e) => {
    const file = e.target?.files?.[0];
    if (file && isAcceptedFile(file)) setSelectedFile(file);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleUpload = async () => {
    const file = selectedFile && selectedFile instanceof File ? selectedFile : null;
    if (!file) {
      toast.warn("Please select a CSV or Excel file first.");
      return;
    }
    if (!isAcceptedFile(file)) {
      toast.warn("Accepted formats: .csv, .xls, .xlsx");
      return;
    }
    setUploading(true);
    setLastResult(null);
    try {
      let fileToSend = file;
      if (/\.(xlsx?|xls)$/i.test(file.name)) {
        try {
          fileToSend = await excelToCsvFile(file);
        } catch (convErr) {
          toast.error(convErr.message || "Failed to read Excel file. Ensure it has one sheet with data.");
          setUploading(false);
          return;
        }
      }
      const formData = new FormData();
      formData.append("file", fileToSend);
      const res = await apiRequest("/api/v1/import/leads/upload", { method: "POST", body: formData });
      setLastResult(res);
      const historyRes = await apiRequest("/api/v1/import/history");
      setImportHistory(historyRes.history || []);
      toast.success(`Import completed: ${res.imported ?? 0} imported, ${res.duplicates ?? 0} duplicates skipped.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (err?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      if (err?.status === 403) {
        toast.error("You don't have permission to upload leads.");
      } else {
        toast.error(err.message || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Upload className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Bulk Upload</h1>
            <p className="text-[13px] text-black/70">CSV or Excel import for leads. Columns auto-mapped; duplicates detected by email & phone.</p>
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
              <p className="text-xs text-black/70 mt-0.5">Upload a CSV or Excel file (.csv, .xls, .xlsx) with leads. Columns will be auto-mapped. Duplicates are detected by email & phone.</p>
            </div>
          </div>
          <div className="p-6">
            {lastResult && (
              <div className="mb-4 p-4 rounded-xl bg-brand-soft border border-gray-200 text-sm">
                <p className="font-medium text-brand-dark">Last import: {lastResult.imported ?? 0} imported, {lastResult.duplicates ?? 0} duplicates skipped{(lastResult.errors && lastResult.errors.length) ? `, ${lastResult.errors.length} errors` : ""}.</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
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
              <p className="text-sm font-medium text-black mb-1">Drop CSV or Excel file here or click to browse</p>
              <p className="text-xs text-black/60">Accepted: .csv, .xls, .xlsx</p>
              {selectedFile && (
                <p className="mt-3 text-sm font-medium text-brand truncate max-w-xs" title={selectedFile.name}>
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={!selectedFile || uploading}
                onClick={handleUpload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {uploading ? "Uploading…" : "Upload file"}
              </button>
            </div>
          </div>
        </div>

        {/* Required CSV Column Format */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" strokeWidth={2} />
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
            {loading ? (
              <div className="px-5 py-8 text-center text-body text-sm">Loading history…</div>
            ) : importHistory.length === 0 ? (
              <div className="px-5 py-8 text-center text-body text-sm">No import history yet.</div>
            ) : (
              importHistory.map((item) => (
                <div key={item._id || item.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition">
                  <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0">
                    <FileText className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black truncate" title={item.filename || item.fileName}>{item.filename || item.fileName}</p>
                    <p className="text-xs text-black/60 mt-0.5">
                      Uploaded by {(item.uploadedBy && (item.uploadedBy.name || item.uploadedBy)) || "—"} on {item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-emerald-600">{item.imported ?? 0} Imported</span>
                    <span className="text-sm font-semibold text-red-600">{item.duplicates ?? item.duplicatesSkipped ?? 0} duplicates skipped</span>
                    {(item.failed ?? 0) > 0 && (
                      <span className="text-sm font-medium text-amber-600">{item.failed} errors</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
