import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  ClipboardList,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const CSV_COLUMNS = [
  { header: "first_name", field: "First Name", required: "Required", example: "Ratan" },
  { header: "last_name", field: "Last Name", required: "Required", example: "Mehta" },
  { header: "company", field: "Company", required: "Optional", example: "TechNova Pvt Ltd" },
  { header: "phone", field: "Phone", required: "Required", example: "9876543216" },
  { header: "email", field: "Email", required: "Optional", example: "rohan@technova.com" },
  { header: "industry", field: "Industry", required: "Optional", example: "Technology" },
  { header: "city", field: "City", required: "Optional", example: "Bangalore" },
  { header: "country", field: "Country", required: "Optional", example: "India" },
  { header: "source", field: "Lead Source", required: "Required", example: "Cold Call" },
  { header: "notes", field: "Notes", required: "Optional", example: "Met at conference" },
];

export default function AdminBulkUploadPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const adminUser = storedUser ? { name: storedUser.name || "Admin", role: storedUser.role || "Admin", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "Admin", role: "Admin", email: "", initials: "AD" };

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

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
        toast.error(err.message || "Failed to load import history");
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files?.length) {
      const file = files[0];
      if (file && file.name && /\.(csv|xlsx?)$/i.test(file.name)) {
        setSelectedFile(file);
      } else {
        toast.warn("Please drop a CSV or Excel file.");
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files?.length) setSelectedFile(files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn("Please select a CSV file first.");
      return;
    }
    const file = typeof selectedFile === "object" && selectedFile instanceof File ? selectedFile : null;
    if (!file) {
      toast.warn("Please select a file again.");
      return;
    }
    if (!/\.csv$/i.test(file.name)) {
      toast.warn("Backend accepts CSV only. Please upload a .csv file.");
      return;
    }
    setUploading(true);
    setLastResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
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
      toast.error(err.message || "Upload failed");
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
            <p className="text-[13px] text-black/70">Import leads or contacts from CSV or Excel in one go.</p>
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
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{adminUser.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{adminUser.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{adminUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{adminUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{adminUser.email}</p>
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

      <div className="flex-1 min-h-0 p-6 overflow-auto space-y-6">
        {/* Bulk Lead Upload section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand" strokeWidth={2} />
            <h2 className="text-base font-semibold text-brand-dark">Bulk Lead Upload (CSV / Excel)</h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-body mb-4">
              Upload a CSV file with leads. Columns will be auto-mapped. Duplicates are detected by email &amp; phone.
            </p>
            {lastResult && (
              <div className="mb-4 p-4 rounded-xl bg-brand-soft border border-gray-200 text-sm">
                <p className="font-medium text-brand-dark">Last import: {lastResult.imported ?? 0} imported, {lastResult.duplicates ?? 0} duplicates skipped{(lastResult.errors && lastResult.errors.length) ? `, ${lastResult.errors.length} errors` : ""}.</p>
              </div>
            )}
            <label
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 px-6 cursor-pointer transition ${
                dragOver ? "border-brand bg-brand-soft/50" : "border-gray-200 hover:border-brand hover:bg-brand-soft/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="w-12 h-12 text-gray-400 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-brand-dark mb-1">
                {selectedFile ? (typeof selectedFile === "object" && selectedFile instanceof File ? selectedFile.name : String(selectedFile)) : "Drop CSV file here or click to browse"}
              </p>
              <p className="text-xs text-body">
                Accepted .csv only
              </p>
            </label>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={!selectedFile || uploading}
                onClick={handleUpload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {uploading ? "Uploading…" : "Upload CSV"}
              </button>
            </div>
          </div>
        </div>

        {/* Required CSV Column Format */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={2} />
            <h2 className="text-base font-semibold text-brand-dark">Required CSV Column Format</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Column Header</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Field Mapped To</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Required</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Example</th>
                </tr>
              </thead>
              <tbody>
                {CSV_COLUMNS.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 font-medium text-brand-dark">{row.header}</td>
                    <td className="py-3 px-3 text-body">{row.field}</td>
                    <td className="py-3 px-3">
                      <span className={row.required === "Required" ? "text-danger font-medium" : "text-body"}>
                        {row.required}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand" strokeWidth={2} />
            <h2 className="text-base font-semibold text-brand-dark">Import History</h2>
          </div>
          <div className="p-5">
            {loading ? (
              <p className="text-body text-sm">Loading history…</p>
            ) : importHistory.length === 0 ? (
              <p className="text-body text-sm">No import history yet.</p>
            ) : (
              <ul className="space-y-4">
                {importHistory.map((item) => (
                  <li
                    key={item._id || item.id || Math.random()}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <span className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-brand" strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-dark">{item.filename || item.fileName}</p>
                      <p className="text-xs text-body">
                        Uploaded by {(item.uploadedBy && (item.uploadedBy.name || item.uploadedBy)) || "—"} on {item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : item.date || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-semibold text-success">{item.imported ?? 0} Imported</span>
                      <span className="text-sm font-medium text-body">
                        {item.duplicates ?? item.duplicatesSkipped ?? 0} duplicates skipped
                      </span>
                      {(item.failed ?? 0) > 0 && (
                        <span className="text-sm font-medium text-danger">{item.failed} errors</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
