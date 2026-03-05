import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  User,
  LogOut,
} from "lucide-react";
import { apiRequest, getStoredUser, getToken, clearAuth } from "../../utils/api";

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function mapDocumentToRow(doc) {
  const uploader = doc.uploadedBy && typeof doc.uploadedBy === "object" ? doc.uploadedBy : null;
  const deal = doc.dealId && typeof doc.dealId === "object" ? doc.dealId : null;
  const dateStr = doc.date ? new Date(doc.date).toISOString().slice(0, 10) : "—";
  return {
    id: doc._id,
    fileName: doc.name || "—",
    type: doc.type || "Document",
    company: doc.company || "—",
    linkedDeal: deal ? deal.title : "—",
    dealId: deal ? (deal._id || deal.id) : null,
    uploadedBy: uploader ? uploader.name : "—",
    uploadedByInitials: getInitials(uploader ? uploader.name : ""),
    date: dateStr,
    size: doc.size || "—",
    notes: doc.notes || "—",
    isPdf: (doc.name || "").toLowerCase().endsWith(".pdf"),
  };
}

const FILE_TYPES = ["Document", "Proposal", "Call Recording", "Contract"];

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (typeof bytes === "number") {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
  return String(bytes);
}

const TYPE_STYLES = {
  Document: "bg-gray-100 text-gray-700",
  Proposal: "bg-violet-100 text-violet-700",
  Contract: "bg-emerald-100 text-emerald-700",
  "Call Recording": "bg-amber-100 text-amber-700",
};

const initialUploadForm = {
  fileName: "",
  fileType: "Document",
  company: "",
  fileSize: "",
  linkedDealId: "",
  uploadDate: "",
  notes: "",
};

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

export default function DocumentsPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const currentUser = storedUser ? { name: storedUser.name || "User", role: storedUser.role || "Sales Rep", email: storedUser.email || "", initials: getInitials(storedUser.name) } : { name: "User", role: "Sales Rep", email: "", initials: "—" };

  const [documents, setDocuments] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const canDelete = storedUser && storedUser.role === "Admin";

  useEffect(() => {
    if (!getToken()) {
      toast.info("Please log in to manage documents.");
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const [docsRes, dealsRes] = await Promise.all([
          apiRequest("/api/v1/documents?page=1&limit=200"),
          apiRequest("/api/v1/deals?page=1&limit=200").catch(() => ({ deals: [] })),
        ]);
        if (cancelled) return;
        setDocuments((docsRes.documents || []).map(mapDocumentToRow));
        setDeals(dealsRes.deals || []);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        toast.error(err.message || "Failed to load documents");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = documents.filter((row) => {
    const matchSearch = !search || (row.fileName || "").toLowerCase().includes(search.toLowerCase()) || (row.company || "").toLowerCase().includes(search.toLowerCase()) || (row.linkedDeal || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All Types" || row.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalFiles = documents.length;
  const callRecordings = documents.filter((d) => d.type === "Call Recording").length;
  const proposals = documents.filter((d) => d.type === "Proposal").length;
  const contracts = documents.filter((d) => d.type === "Contract").length;

  const handleDelete = async (id) => {
    if (!canDelete) return;
    try {
      await apiRequest(`/api/v1/documents/${id}`, { method: "DELETE" });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success("Document deleted");
    } catch (err) {
      if (err?.status === 401) { clearAuth(); toast.error("Session expired. Please log in again."); navigate("/login", { replace: true }); return; }
      toast.error(err.message || "Failed to delete document");
    }
  };

  const openEditDocument = (row) => {
    setUploadForm({
      fileName: row.fileName === "—" ? "" : row.fileName,
      fileType: row.type || "Document",
      company: row.company === "—" ? "" : row.company,
      fileSize: row.size === "—" ? "" : row.size,
      linkedDealId: row.dealId || "",
      uploadDate: row.date && row.date !== "—" ? row.date : "",
      notes: row.notes === "—" ? "" : row.notes,
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

  const handleUploadFormChange = (field, value) => { setUploadForm((prev) => ({ ...prev, [field]: value })); };

  const handleFileSelect = (file) => {
    if (!file) return;
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) return;
    setSelectedFile(file);
    setUploadForm((prev) => ({ ...prev, fileName: file.name, fileSize: formatFileSize(file.size) }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer?.files?.[0]);
  };

  const handleSaveUpload = async () => {
    const { fileName, fileType, company, fileSize, linkedDealId, uploadDate, notes } = uploadForm;
    if (!fileName.trim()) {
      toast.error("File name is required");
      return;
    }
    const date = uploadDate ? new Date(toYyyyMmDd(uploadDate)).toISOString() : new Date().toISOString();
    const payload = {
      name: fileName.trim(),
      type: fileType,
      company: company.trim() || undefined,
      size: fileSize || undefined,
      url: selectedFile ? undefined : "#",
      dealId: linkedDealId || undefined,
      date,
      notes: notes.trim() || undefined,
    };
    try {
      if (editingDocument) {
        const res = await apiRequest(`/api/v1/documents/${editingDocument.id}`, { method: "PUT", body: payload });
        setDocuments((prev) => prev.map((d) => (d.id === editingDocument.id ? mapDocumentToRow(res.document) : d)));
        toast.success("Document updated successfully");
      } else {
        const res = await apiRequest("/api/v1/documents", { method: "POST", body: payload });
        setDocuments((prev) => [mapDocumentToRow(res.document), ...prev]);
        toast.success("Document added successfully");
      }
      setUploadForm(initialUploadForm);
      setSelectedFile(null);
      setUploadModalOpen(false);
      setEditingDocument(null);
    } catch (err) {
      if (err?.status === 401) { clearAuth(); toast.error("Session expired. Please log in again."); navigate("/login", { replace: true }); return; }
      toast.error(err.message || "Failed to save document");
    }
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
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden><FileStack className="w-5 h-5" strokeWidth={2} /></span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Documents</h1>
            <p className="text-[13px] text-black/70">Store and manage proposals, contracts, and call recordings.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input type="search" placeholder="Search anything..." className="w-64 px-4 py-2 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          <button type="button" className="w-10 h-10 rounded-xl bg-brand-soft border border-gray-200 flex items-center justify-center text-body hover:bg-brand-light transition" aria-label="Notifications"><Bell className="w-5 h-5" strokeWidth={2} /></button>
          <button type="button" onClick={() => { setEditingDocument(null); setUploadForm(initialUploadForm); setUploadModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"><Plus className="w-4 h-4" strokeWidth={2} /> Upload File</button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{currentUser.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{currentUser.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{currentUser.name}</p>
                      <p className="text-xs font-medium text-black/70">{currentUser.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left"><User className="w-4 h-4 text-gray-500" strokeWidth={2} /> My Profile</button>
                  <button type="button" onClick={() => { clearAuth(); navigate("/login"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"><LogOut className="w-4 h-4" strokeWidth={2} /> Log out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Files</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{totalFiles}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Files</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><FileStack className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Call Recordings</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">{callRecordings}</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform"><Mic className="w-6 h-6 text-violet-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Proposals</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{proposals}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform"><FileText className="w-6 h-6 text-blue-700" strokeWidth={2} /></span>
            </div>
          </div>
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Contracts</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{contracts}</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform"><FileCheck className="w-6 h-6 text-emerald-700" strokeWidth={2} /></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2"><FileStack className="w-5 h-5 text-brand" strokeWidth={2} /> Document Library</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input type="search" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8">
                <option>All Types</option>
                <option>Document</option><option>Proposal</option><option>Contract</option><option>Call Recording</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-body text-sm">Loading documents…</div>
          ) : (
            <React.Fragment>
              <div className="overflow-x-auto">
                <table className="w-max min-w-[1000px] text-sm table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-semibold text-black">S.No</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">File Name</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Type</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Linked Deal</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Uploaded By</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Date</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Size</th>
                      <th className="text-left py-3 px-3 font-semibold text-black">Notes</th>
                      <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                        <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                              {row.isPdf ? <FileText className="w-4 h-4 text-red-600" strokeWidth={2} /> : <Mic className="w-4 h-4 text-amber-600" strokeWidth={2} />}
                            </span>
                            <span className="font-medium text-brand-dark truncate" title={row.fileName}>{row.fileName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"}`}>{row.type}</span>
                        </td>
                        <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                        <td className="py-3 px-3"><span className="text-brand font-medium">{row.linkedDeal}</span></td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">{row.uploadedByInitials}</span>
                            <span className="text-body truncate min-w-0" title={row.uploadedBy}>{row.uploadedBy}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-body tabular-nums whitespace-nowrap">{row.date}</td>
                        <td className="py-3 px-3 text-body tabular-nums">{row.size}</td>
                        <td className="py-3 px-3 text-body min-w-0 truncate" title={row.notes}>{row.notes || "—"}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => openViewDocument(row)} className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition" aria-label="View file"><Eye className="w-4 h-4" strokeWidth={2} /></button>
                            <button type="button" onClick={() => openEditDocument(row)} className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition" aria-label="Edit file"><Pencil className="w-4 h-4" strokeWidth={2} /></button>
                            {canDelete && <button type="button" onClick={() => handleDelete(row.id)} className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition" aria-label="Delete file"><Trash2 className="w-4 h-4" strokeWidth={2} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && <div className="py-12 text-center text-body text-sm">No documents match your filters.</div>}
            </React.Fragment>
          )}
        </div>
      </div>

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeUploadModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingDocument ? "Edit Document" : "Upload Document"}</h2>
              <button type="button" onClick={closeUploadModal} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close"><X className="w-5 h-5" strokeWidth={2} /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-3 border-b border-brand/30 pb-2">File Upload</p>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.mp3,.mp4" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0])} />
              <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition mb-6 ${isDragging ? "border-brand bg-brand-soft" : "border-gray-200 hover:border-brand hover:bg-brand-soft/50"}`}>
                <Paperclip className="w-12 h-12 mx-auto text-brand mb-3" strokeWidth={1.5} />
                <p className="text-body font-medium">Click to select file or drag & drop</p>
                <p className="text-xs text-brand mt-1">PDF, DOC, MP3, MP4 up to 50MB</p>
                {selectedFile && <p className="text-sm text-emerald-600 mt-2">{selectedFile.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className={labelClass}>File name *</label><input type="text" value={uploadForm.fileName} onChange={(e) => handleUploadFormChange("fileName", e.target.value)} placeholder="document.pdf" className={inputClass} /></div>
                <div><label className={labelClass}>Company</label><input type="text" value={uploadForm.company} onChange={(e) => handleUploadFormChange("company", e.target.value)} placeholder="Company name" className={inputClass} /></div>
                <div><label className={labelClass}>File type</label><select value={uploadForm.fileType} onChange={(e) => handleUploadFormChange("fileType", e.target.value)} className={inputClass}>{FILE_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                <div><label className={labelClass}>Linked deal</label><select value={uploadForm.linkedDealId} onChange={(e) => handleUploadFormChange("linkedDealId", e.target.value)} className={inputClass}><option value="">— None —</option>{deals.map((d) => <option key={d._id || d.id} value={d._id || d.id}>{d.title || d.company || d._id}</option>)}</select></div>
                <div><label className={labelClass}>File size</label><input type="text" value={uploadForm.fileSize} readOnly placeholder="e.g. 2.4 MB" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Upload date (dd-mm-yyyy)</label><input type="text" value={uploadForm.uploadDate} onChange={(e) => handleUploadFormChange("uploadDate", e.target.value)} placeholder="dd-mm-yyyy" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Notes</label><textarea value={uploadForm.notes} onChange={(e) => handleUploadFormChange("notes", e.target.value)} placeholder="Additional notes..." rows={3} className={inputClass + " w-full resize-y min-h-[80px]"} /></div>
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button type="button" onClick={closeUploadModal} className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition">Cancel</button>
              <button type="button" onClick={handleSaveUpload} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"><Save className="w-4 h-4" strokeWidth={2} />{editingDocument ? "Save changes" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingDocument(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">View Document</h2>
              <button type="button" onClick={() => setViewingDocument(null)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close"><X className="w-5 h-5" strokeWidth={2} /></button>
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
