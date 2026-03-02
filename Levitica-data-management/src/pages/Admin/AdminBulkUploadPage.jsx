import React, { useState } from "react";
import {
  Bell,
  ClipboardList,
  AlertCircle,
  Clock,
  FileText,
  Upload,
} from "lucide-react";

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

const INITIAL_IMPORT_HISTORY = [
  { id: 1, fileName: "cold-call-list-feb.csv", uploadedBy: "Vikram Joshi", date: "2025-02-10", imported: 132, duplicatesSkipped: 13 },
  { id: 2, fileName: "linkedin-export-jan.csv", uploadedBy: "Vikram Joshi", date: "2025-01-24", imported: 84, duplicatesSkipped: 5 },
  { id: 3, fileName: "event-leads-bangalore.csv", uploadedBy: "Meena Reddy", date: "2025-01-15", imported: 56, duplicatesSkipped: 0 },
];

export default function AdminBulkUploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (files.length) setSelectedFile(files[0].name);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files?.length) setSelectedFile(files[0].name);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">Bulk Upload</h1>
          <p className="text-sm text-body">/ CSV/Excel Import</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search CRM..."
            className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
          />
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
          </button>
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
            <label
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 px-6 cursor-pointer transition ${
                dragOver ? "border-brand bg-brand-soft/50" : "border-gray-200 hover:border-brand hover:bg-brand-soft/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="w-12 h-12 text-gray-400 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-brand-dark mb-1">
                {selectedFile ? selectedFile : "Drop CSV/Excel file here or click to browse"}
              </p>
              <p className="text-xs text-body">
                Accepted .csv, .xlsx · Max 10,000 rows
              </p>
            </label>
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
            <ul className="space-y-4">
              {INITIAL_IMPORT_HISTORY.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <span className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-brand" strokeWidth={2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-dark">{item.fileName}</p>
                    <p className="text-xs text-body">
                      Uploaded by {item.uploadedBy} on {item.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-semibold text-success">{item.imported} Imported</span>
                    <span className="text-sm font-medium text-danger">
                      {item.duplicatesSkipped} duplicates skipped
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
