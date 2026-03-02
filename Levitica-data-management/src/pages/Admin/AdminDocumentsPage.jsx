import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Mic,
  FileStack,
  FileCheck,
  X,
  Save,
  Paperclip,
  Calendar,
} from "lucide-react";

const LINKED_DEALS = ["— None —", "TechNova Enterprise License", "GreenPath Consulting Module", "Horizon Retail Integration", "MediCore Healthcare Module", "EduLeap Education Suite", "FinPlex SaaS Starter"];
const LINKED_CONTACTS = ["— None —", "Suresh Rajan", "Meena Joshi", "Deepak Verma", "Priya Nair", "Arun Krishnan"];
const FILE_TYPES = ["Document", "Proposal", "Call Recording", "Contract"];

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const TYPE_STYLES = {
  Document: "bg-gray-100 text-gray-700",
  Proposal: "bg-violet-100 text-violet-700",
  Contract: "bg-emerald-100 text-emerald-700",
  "Call Recording": "bg-amber-100 text-amber-700",
};

const INITIAL_DOCUMENTS = [
  { id: 1, fileName: "TechNova_Enterprise_Proposal.pdf", type: "Proposal", company: "TechNova Pvt Ltd", linkedDeal: "TechNova Enterprise License", uploadedBy: "Vikram Joshi", uploadedByInitials: "VJ", date: "2025-01-17", size: "2.4 MB", notes: "Final accepted proposal", isPdf: true },
  { id: 2, fileName: "MediCore Contract Signed.pdf", type: "Contract", company: "MediCore India", linkedDeal: "MediCore Healthcare Platform", uploadedBy: "Aditya Kumar", uploadedByInitials: "AK", date: "2025-02-20", size: "2.8 MB", notes: "Executed 2-year contract", isPdf: true },
  { id: 3, fileName: "Discovery_Call_TechNova.mp3", type: "Call Recording", company: "TechNova Pvt Ltd", linkedDeal: "TechNova Enterprise License", uploadedBy: "Vikram Joshi", uploadedByInitials: "VJ", date: "2025-01-15", size: "8.2 MB", notes: "Initial discovery call", isPdf: false },
  { id: 4, fileName: "Horizon_Negotiation_Call.mp3", type: "Call Recording", company: "Horizon Retail Co", linkedDeal: "Horizon Retail Integration", uploadedBy: "Vikram Joshi", uploadedByInitials: "VJ", date: "2025-02-18", size: "5.7 MB", notes: "Discount discussion call", isPdf: false },
  { id: 5, fileName: "GreenPath_Proposal_v2.pdf", type: "Proposal", company: "GreenPath Solutions", linkedDeal: "GreenPath Consulting Module", uploadedBy: "Meena Reddy", uploadedByInitials: "MR", date: "2025-02-18", size: "2.2 MB", notes: "Revised proposal with payment terms", isPdf: true },
];

const initialUploadForm = {
  fileName: "",
  fileType: "Document",
  company: "",
  fileSize: "",
  linkedDeal: "— None —",
  linkedContact: "— None —",
  uploadDate: "",
  notes: "",
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

  const filtered = documents.filter((row) => {
    const matchSearch =
      !search ||
      row.fileName.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.linkedDeal.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All Types" || row.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalFiles = documents.length;
  const callRecordings = documents.filter((d) => d.type === "Call Recording").length;
  const proposals = documents.filter((d) => d.type === "Proposal").length;
  const contracts = documents.filter((d) => d.type === "Contract").length;

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document deleted");
  };

  const openEditDocument = (row) => {
    setUploadForm({
      fileName: row.fileName || "",
      fileType: row.type || "Document",
      company: row.company || "",
      fileSize: row.size || "",
      linkedDeal: row.linkedDeal === "—" ? "— None —" : row.linkedDeal || "— None —",
      linkedContact: "— None —",
      uploadDate: row.date ? row.date.split("-").reverse().join("-") : "",
      notes: row.notes || "—",
    });
    setEditingDocument(row);
    setUploadModalOpen(true);
  };

  const openViewDocument = (row) => setViewingDocument(row);

  const toYyyyMmDd = (ddMmYyyy) => {
    if (!ddMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(ddMmYyyy)) return ddMmYyyy || "";
    const [d, m, y] = ddMmYyyy.split("-");
    return `${y}-${m}-${d}`;
  };

  const handleUploadFormChange = (field, value) => {
    setUploadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) return;
    setSelectedFile(file);
    setUploadForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer?.files?.[0]);
  };

  const handleSaveUpload = () => {
    const { fileName, fileType, company, fileSize, linkedDeal, linkedContact, uploadDate, notes } = uploadForm;
    if (!fileName.trim()) return;
    const date = toYyyyMmDd(uploadDate) || new Date().toISOString().slice(0, 10);
    const deal = linkedDeal === "— None —" ? "—" : linkedDeal;
    const ext = (fileName.split(".").pop() || "").toLowerCase();
    const isPdf = ext === "pdf";
    const payload = {
      fileName: fileName.trim(),
      type: fileType,
      company: company.trim() || "—",
      linkedDeal: deal || "—",
      uploadedBy: editingDocument ? editingDocument.uploadedBy : "Priya Nair",
      uploadedByInitials: editingDocument ? editingDocument.uploadedByInitials : "PN",
      date,
      size: fileSize || "—",
      notes: notes.trim() || "—",
      isPdf,
    };
    if (editingDocument) {
      setDocuments((prev) => prev.map((d) => (d.id === editingDocument.id ? { ...payload, id: d.id } : d)));
      setEditingDocument(null);
      toast.success("Document updated successfully");
    } else {
      setDocuments((prev) => [{ ...payload, id: Math.max(0, ...documents.map((d) => d.id)) + 1 }, ...prev]);
      toast.success("Document uploaded successfully");
    }
    setUploadForm(initialUploadForm);
    setSelectedFile(null);
    setUploadModalOpen(false);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setUploadForm(initialUploadForm);
    setSelectedFile(null);
    setIsDragging(false);
    setEditingDocument(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <FileStack className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Documents</h1>
            <p className="text-sm text-body leading-snug">Store and manage proposals, contracts, and call recordings.</p>
          </div>
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
          <button
            type="button"
            onClick={() => { setEditingDocument(null); setUploadForm(initialUploadForm); setUploadModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Upload File
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Four summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Total Files</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{totalFiles}</p>
                <p className="text-xs text-gray-500 mt-1.5">Files</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileStack className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-violet-600/90 uppercase tracking-wider mb-1.5">Call Recordings</p>
                <p className="text-2xl font-bold text-violet-700 tabular-nums tracking-tight">{callRecordings}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-violet-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider mb-1.5">Proposals</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight">{proposals}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider mb-1.5">Contracts</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">{contracts}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Document Library table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-brand-dark mb-4">Document Library</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
              >
                <option>All Types</option>
                <option>Document</option>
                <option>Proposal</option>
                <option>Contract</option>
                <option>Call Recording</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1000px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">File Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Linked Deal</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Uploaded By</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Size</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Notes</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                          {row.isPdf ? (
                            <FileText className="w-4 h-4 text-red-600" strokeWidth={2} />
                          ) : (
                            <Mic className="w-4 h-4 text-amber-600" strokeWidth={2} />
                          )}
                        </span>
                        <span className="font-medium text-brand-dark truncate" title={row.fileName}>{row.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3">
                      <button type="button" className="text-brand hover:underline font-medium text-left">
                        {row.linkedDeal}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {row.uploadedByInitials}
                        </span>
                        <span className="text-body truncate min-w-0" title={row.uploadedBy}>{row.uploadedBy}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-body tabular-nums whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 text-body tabular-nums">{row.size}</td>
                    <td className="py-3 px-3 text-body min-w-0 truncate" title={row.notes}>
                      {row.notes || "—"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openViewDocument(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="View file"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditDocument(row)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit file"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                          aria-label="Delete file"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-body text-sm">No documents match your filters.</div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeUploadModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingDocument ? "Edit Document" : "Upload Document"}</h2>
              <button
                type="button"
                onClick={closeUploadModal}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-3 border-b border-brand/30 pb-2">File Upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.mp3,.mp4"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition mb-6 ${
                  isDragging ? "border-brand bg-brand-soft" : "border-gray-200 hover:border-brand hover:bg-brand-soft/50"
                }`}
              >
                <Paperclip className="w-12 h-12 mx-auto text-brand mb-3" strokeWidth={1.5} />
                <p className="text-body font-medium">Click to select file or drag & drop</p>
                <p className="text-xs text-brand mt-1">PDF, DOC, MP3, MP4 up to 50MB</p>
                {selectedFile && (
                  <p className="text-sm text-success mt-2">{selectedFile.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">File name *</label>
                  <input
                    type="text"
                    value={uploadForm.fileName}
                    onChange={(e) => handleUploadFormChange("fileName", e.target.value)}
                    placeholder="document.pdf"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                  <input
                    type="text"
                    value={uploadForm.company}
                    onChange={(e) => handleUploadFormChange("company", e.target.value)}
                    placeholder="Company name"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">File type</label>
                  <select
                    value={uploadForm.fileType}
                    onChange={(e) => handleUploadFormChange("fileType", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {FILE_TYPES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked deal</label>
                  <select
                    value={uploadForm.linkedDeal}
                    onChange={(e) => handleUploadFormChange("linkedDeal", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {LINKED_DEALS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">File size</label>
                  <input
                    type="text"
                    value={uploadForm.fileSize}
                    readOnly
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked contact</label>
                  <select
                    value={uploadForm.linkedContact}
                    onChange={(e) => handleUploadFormChange("linkedContact", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                  >
                    {LINKED_CONTACTS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Upload date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={uploadForm.uploadDate}
                      onChange={(e) => handleUploadFormChange("uploadDate", e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes</label>
                  <textarea
                    value={uploadForm.notes}
                    onChange={(e) => handleUploadFormChange("notes", e.target.value)}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-y min-h-[80px]"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={closeUploadModal}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUpload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm shadow-sm transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingDocument ? "Save changes" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingDocument(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">View Document</h2>
              <button type="button" onClick={() => setViewingDocument(null)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">File Name</span><p className="font-medium text-brand-dark mt-0.5">{viewingDocument.fileName}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Type</span><p className="text-body mt-0.5">{viewingDocument.type}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Company</span><p className="text-body mt-0.5">{viewingDocument.company}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Linked Deal</span><p className="text-body mt-0.5">{viewingDocument.linkedDeal}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Uploaded By</span><p className="text-body mt-0.5">{viewingDocument.uploadedBy}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Date</span><p className="text-body mt-0.5">{viewingDocument.date}</p></div>
              <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Size</span><p className="text-body mt-0.5">{viewingDocument.size}</p></div>
              {viewingDocument.notes && viewingDocument.notes !== "—" && <div><span className="text-xs font-semibold text-body uppercase tracking-wider">Notes</span><p className="text-body mt-0.5">{viewingDocument.notes}</p></div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
