import React, { useState, useRef, useEffect } from "react";
import { Bell, Folder, Plus, Pencil, Eye, FileText, FileAudio, X, Save, Paperclip, Calendar, Trash2, User, LogOut } from "lucide-react";

const SALES_USER = { name: "Vikram Joshi", role: "Sales Rep", email: "vikram.joshi@company.com", initials: "VJ" };

const inputClass =
  "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function UploadDocumentModal({ open, onClose, onSave, document: editingDoc }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    fileName: "",
    fileType: "Proposal",
    company: "",
    fileSize: "",
    linkedDeal: "",
    linkedContact: "",
    uploadDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingDoc) {
      setForm({
        fileName: editingDoc.fileName || "",
        fileType: editingDoc.type || "Proposal",
        company: editingDoc.company === "-" ? "" : (editingDoc.company || ""),
        fileSize: editingDoc.size === "-" ? "" : (editingDoc.size || ""),
        linkedDeal: editingDoc.linkedDeal === "-" ? "" : (editingDoc.linkedDeal || ""),
        linkedContact: "",
        uploadDate: editingDoc.date || new Date().toISOString().slice(0, 10),
        notes: editingDoc.notes || "",
      });
      setSelectedFile(null);
    } else {
      setForm({
        fileName: "",
        fileType: "Proposal",
        company: "",
        fileSize: "",
        linkedDeal: "",
        linkedContact: "",
        uploadDate: new Date().toISOString().slice(0, 10),
        notes: "",
      });
      setSelectedFile(null);
    }
  }, [open, editingDoc]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return; // could show toast
    }
    setSelectedFile(file);
    setForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fileName?.trim()) return;
    const fileUrl = selectedFile
      ? URL.createObjectURL(selectedFile)
      : (editingDoc?.fileUrl ?? null);
    const newDoc = {
      id: editingDoc?.id ?? Date.now(),
      fileName: form.fileName.trim(),
      type: form.fileType,
      company: form.company?.trim() || "-",
      linkedDeal: form.linkedDeal || "-",
      uploadedBy: editingDoc?.uploadedBy || "Vikram Joshi",
      uploadedByInitials: editingDoc?.uploadedByInitials || "VJ",
      date: form.uploadDate,
      size: form.fileSize || "-",
      notes: form.notes?.trim() || "",
      fileUrl,
    };
    onSave(newDoc, !!editingDoc);
    setForm({
      fileName: "",
      fileType: "Proposal",
      company: "",
      fileSize: "",
      linkedDeal: "",
      linkedContact: "",
      uploadDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setSelectedFile(null);
    onClose();
  };

  const resetForm = () => {
    setForm({
      fileName: "",
      fileType: "Proposal",
      company: "",
      fileSize: "",
      linkedDeal: "",
      linkedContact: "",
      uploadDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setSelectedFile(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={resetForm} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingDoc ? "Edit Document" : "Upload Document"}</h2>
          <button
            type="button"
            onClick={resetForm}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-3 border-b border-brand/30 pb-2">
            File Upload
          </p>
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>File Name *</label>
              <input
                type="text"
                name="fileName"
                value={form.fileName}
                onChange={handleChange}
                placeholder="document.pdf"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>File Type</label>
              <select name="fileType" value={form.fileType} onChange={handleChange} className={inputClass}>
                <option>Proposal</option>
                <option>Call Recording</option>
                <option>Contract</option>
                <option>Document</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>File Size</label>
              <input
                type="text"
                name="fileSize"
                value={form.fileSize}
                onChange={handleChange}
                placeholder="e.g. 2.4 MB"
                className={inputClass}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Linked Deal</label>
              <select name="linkedDeal" value={form.linkedDeal} onChange={handleChange} className={inputClass}>
                <option value="">— None —</option>
                <option>Horizon Retail Integration</option>
                <option>TechNova Enterprise License</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Linked Contact</label>
              <select name="linkedContact" value={form.linkedContact} onChange={handleChange} className={inputClass}>
                <option value="">— None —</option>
                <option>Suresh Rajan</option>
                <option>Dev Malhotra</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Upload Date</label>
            <div className="relative">
              <input
                type="date"
                name="uploadDate"
                value={form.uploadDate}
                onChange={handleChange}
                className={inputClass + " pr-10"}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes..."
              className={inputClass + " min-h-[80px] resize-y"}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function isPdf(doc) {
  const name = (doc?.fileName || "").toLowerCase();
  return name.endsWith(".pdf") || doc?.type === "Proposal" || doc?.type === "Contract";
}
function isAudio(doc) {
  const name = (doc?.fileName || "").toLowerCase();
  return name.endsWith(".mp3") || name.endsWith(".wav") || doc?.type === "Call Recording";
}
function isVideo(doc) {
  const name = (doc?.fileName || "").toLowerCase();
  return name.endsWith(".mp4") || name.endsWith(".webm");
}

function ViewDocumentModal({ open, onClose, document: doc }) {
  if (!open || !doc) return null;
  const hasFile = !!doc.fileUrl;
  const showPdf = hasFile && isPdf(doc);
  const showAudio = hasFile && isAudio(doc);
  const showVideo = hasFile && isVideo(doc);
  const showOpenLink = hasFile && !showPdf && !showAudio && !showVideo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
              {doc.type === "Call Recording" ? (
                <FileAudio className="w-5 h-5 text-brand" strokeWidth={2} />
              ) : (
                <FileText className="w-5 h-5 text-brand" strokeWidth={2} />
              )}
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-brand-dark truncate" title={doc.fileName}>{doc.fileName}</h2>
              <p className="text-xs text-gray-500">{doc.type} · {doc.size}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          {hasFile && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Document preview</p>
              {showPdf && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden" style={{ minHeight: "400px" }}>
                  <iframe
                    src={doc.fileUrl}
                    title={doc.fileName}
                    className="w-full h-[70vh] min-h-[400px] border-0"
                  />
                </div>
              )}
              {showAudio && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <audio src={doc.fileUrl} controls className="w-full max-w-md" />
                </div>
              )}
              {showVideo && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                  <video src={doc.fileUrl} controls className="w-full max-h-[50vh]" />
                </div>
              )}
              {showOpenLink && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-soft text-brand font-medium text-sm hover:bg-brand-light transition"
                >
                  <FileText className="w-4 h-4" strokeWidth={2} />
                  Open in new tab
                </a>
              )}
            </div>
          )}
          {!hasFile && (
            <p className="text-sm text-gray-500 italic">No file attached. Upload a file when adding or editing this document to view it here.</p>
          )}

          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">File name</p>
            <p className="text-body">{doc.fileName || "-"}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</p>
              <p className="text-body">{doc.type || "-"}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Size</p>
              <p className="text-body">{doc.size || "-"}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Company</p>
            <p className="text-body">{doc.company || "-"}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Linked deal</p>
            <p className="text-body">{doc.linkedDeal || "-"}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Uploaded by</span>
            <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
              {doc.uploadedByInitials || "—"}
            </span>
            <span className="text-body">{doc.uploadedBy || "-"}</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
            <p className="text-body">{doc.date || "-"}</p>
          </div>
          {doc.notes && (
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-body text-sm">{doc.notes}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-brand text-white font-medium text-sm hover:opacity-95 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    fileName: "TechNova_Enterprise_Proposal.pdf",
    type: "Proposal",
    company: "TechNova Pvt Ltd",
    linkedDeal: "TechNova Enterprise License",
    uploadedBy: "Vikram Joshi",
    uploadedByInitials: "VJ",
    date: "2025-01-17",
    size: "2.4 MB",
    notes: "Final accepted proposal",
  },
  {
    id: 2,
    fileName: "Discovery Call TechNova.mp3",
    type: "Call Recording",
    company: "TechNova Pvt Ltd",
    linkedDeal: "TechNova Enterprise License",
    uploadedBy: "Vikram Joshi",
    uploadedByInitials: "VJ",
    date: "2025-01-15",
    size: "8.2 MB",
    notes: "Initial discovery call",
  },
  {
    id: 3,
    fileName: "Horizon_Negotiation_Call.mp3",
    type: "Call Recording",
    company: "Horizon Retail Co",
    linkedDeal: "Horizon Retail Integration",
    uploadedBy: "Vikram Joshi",
    uploadedByInitials: "VJ",
    date: "2025-02-18",
    size: "5.7 MB",
    notes: "Discount discussion call",
  },
];

function FileIcon({ type, className }) {
  if (type === "Call Recording") {
    return <FileAudio className={className} strokeWidth={2} />;
  }
  return <FileText className={className} strokeWidth={2} />;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleSaveDocument = (doc, isEdit) => {
    if (isEdit) {
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
    } else {
      setDocuments((prev) => [doc, ...prev]);
    }
    setEditingDoc(null);
    setShowUploadModal(false);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const doc = documents.find((d) => d.id === id);
      if (doc?.fileUrl && doc.fileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(doc.fileUrl);
      }
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const filtered = documents.filter((row) => {
    const matchSearch =
      !search ||
      row.fileName?.toLowerCase().includes(search.toLowerCase()) ||
      row.company?.toLowerCase().includes(search.toLowerCase()) ||
      row.linkedDeal?.toLowerCase().includes(search.toLowerCase()) ||
      row.notes?.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "All Types" ||
      row.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalFiles = documents.length;
  const callRecordings = documents.filter((d) => d.type === "Call Recording").length;
  const proposals = documents.filter((d) => d.type === "Proposal").length;
  const contracts = documents.filter((d) => d.type === "Contract").length;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Folder className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Documents</h1>
            <p className="text-[13px] text-black/70">File management and document storage.</p>
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
            onClick={() => { setEditingDoc(null); setShowUploadModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Upload File
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{SALES_USER.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{SALES_USER.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{SALES_USER.name}</p>
                      <p className="text-xs font-medium text-black/70">{SALES_USER.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{SALES_USER.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left"><User className="w-4 h-4 text-gray-500" strokeWidth={2} /> My Profile</button>
                  <button type="button" onClick={() => (window.location.href = "/")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"><LogOut className="w-4 h-4" strokeWidth={2} /> Log out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <UploadDocumentModal
        open={showUploadModal}
        onClose={() => { setShowUploadModal(false); setEditingDoc(null); }}
        onSave={handleSaveDocument}
        document={editingDoc}
      />
      <ViewDocumentModal
        open={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingDoc(null); }}
        document={viewingDoc}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Summary cards - same style as Finance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Files</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{totalFiles}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Files</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Folder className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Call Recordings</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">{callRecordings}</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Recordings</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileAudio className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-teal-100 border-2 border-teal-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">Proposals</p>
                <p className="text-2xl font-bold text-teal-900 tabular-nums tracking-tight">{proposals}</p>
                <p className="text-xs font-medium text-teal-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-teal-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Contracts</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{contracts}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Document Library table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              <Folder className="w-5 h-5 text-brand" strokeWidth={2} />
              Document Library
            </h2>
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
                <option>Proposal</option>
                <option>Call Recording</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-[1000px] text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right py-3 px-3 font-semibold text-black">S.No</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">File Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Type</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Linked Deal</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Uploaded By</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Date</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Size</th>
                  <th className="text-left py-3 px-3 font-semibold text-black">Notes</th>
                  <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-right text-black tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand shrink-0">
                          <FileIcon type={row.type} className="w-4 h-4" />
                        </span>
                        <span className="font-medium text-black truncate" title={row.fileName}>{row.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.type === "Proposal"
                            ? "bg-success/15 text-success"
                            : row.type === "Call Recording"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-black truncate" title={row.company}>{row.company}</td>
                    <td className="py-3 px-3">
                      <button type="button" className="text-brand hover:underline font-medium text-left truncate max-w-full" title={row.linkedDeal}>
                        {row.linkedDeal}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                          {row.uploadedByInitials}
                        </span>
                        <span className="text-black truncate" title={row.uploadedBy}>{row.uploadedBy}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-black tabular-nums whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 text-black tabular-nums">{row.size}</td>
                    <td className="py-3 px-3 text-black truncate max-w-0" title={row.notes}>{row.notes}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setViewingDoc(row); setShowViewModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-gray-100 transition"
                          aria-label="View file"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingDoc(row); setShowUploadModal(true); }}
                          className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                          aria-label="Edit file"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(row.id)}
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
    </>
  );
}
