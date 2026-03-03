import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Check,
  FileText,
  Clock,
  X,
  Save,
  Calendar,
  Activity,
  Phone,
  Mail,
  CalendarDays,
  AlertCircle,
  CheckCircle,
  User,
  LogOut,
} from "lucide-react";

const ADMIN_USER = { name: "Arjun Kapoor", role: "Admin", email: "admin@levitica.com", initials: "AK" };

const ACTIVITY_TYPES = ["Call", "Email", "Meeting"];
const CALL_OUTCOMES = ["—", "Voicemail", "Connected - Interested", "Callback Requested", "No Answer", "Other"];
const REPS = [
  { name: "Priya Nair", initials: "PN" },
  { name: "Vikram Joshi", initials: "VJ" },
  { name: "Meena Reddy", initials: "MR" },
  { name: "Aditya Kumar", initials: "AK" },
  { name: "Kavya Shah", initials: "KS" },
];
const LINKED_DEALS = ["— None —", "TechNova Enterprise License", "GreenPath Consulting Module", "Horizon Retail Integration", "MediCore Healthcare Module", "EduLeap Education Suite", "FinPlex SaaS Starter"];
const LINKED_CONTACTS = ["— None —", "Suresh Rajan", "Meena Joshi", "Deepak Verma", "Priya Nair", "Arun Krishnan"];
const FOLLOW_UP_TYPES = ["Call", "Email", "Meeting", "Follow-up"];

const TYPE_STYLES = {
  Call: "bg-blue-100 text-blue-700",
  Email: "bg-violet-100 text-violet-700",
  Meeting: "bg-amber-100 text-amber-700",
  "Follow-up": "bg-emerald-100 text-emerald-700",
};

const PRIORITY_STYLES = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-600",
};

const TASK_STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Done: "bg-emerald-100 text-emerald-700",
};

const INITIAL_ACTIVITIES = [
  { id: 1, type: "Email", subject: "Proposal Sent - GreenPath", company: "GreenPath Solutions", outcome: "", duration: "", rep: "Meena Reddy", repInitials: "MR", dealLinked: "GreenPath Consulting Module", date: "2025-02-18", recording: "" },
  { id: 2, type: "Call", subject: "Follow-up - GreenPath", company: "GreenPath Solutions", outcome: "Voicemail", duration: "", rep: "Meena Reddy", repInitials: "MR", dealLinked: "GreenPath Consulting Module", date: "2025-02-15", recording: "" },
  { id: 3, type: "Call", subject: "Negotiation Call - Horizon", company: "Horizon Retail Co", outcome: "Callback Requested", duration: "18min", rep: "Vikram Joshi", repInitials: "VJ", dealLinked: "Horizon Retail Integration", date: "2025-02-10", recording: "" },
  { id: 4, type: "Meeting", subject: "Product Demo - TechNova", company: "TechNova Pvt Ltd", outcome: "", duration: "60min", rep: "Vikram Joshi", repInitials: "VJ", dealLinked: "TechNova Enterprise License", date: "2025-01-18", recording: "" },
  { id: 5, type: "Email", subject: "Proposal Follow up Email", company: "TechNova Pvt Ltd", outcome: "", duration: "", rep: "Vikram Joshi", repInitials: "VJ", dealLinked: "TechNova Enterprise License", date: "2025-01-16", recording: "" },
  { id: 6, type: "Call", subject: "Initial Discovery Call", company: "TechNova Pvt Ltd", outcome: "Connected - Interested", duration: "25min", rep: "Vikram Joshi", repInitials: "VJ", dealLinked: "TechNova Enterprise License", date: "2025-01-15", recording: "" },
];

const INITIAL_FOLLOWUP_TASKS = [
  { id: 1, type: "Call", subject: "Follow-up call with Horizon Retail", company: "Horizon Retail Co", dueDate: "2025-02-28", priority: "High", status: "Pending", rep: "Vikram Joshi", repInitials: "VJ", deal: "Horizon Retail Integration" },
  { id: 2, type: "Call", subject: "Cold call batch - FinPlex", company: "FinPlex Systems", dueDate: "2025-03-01", priority: "Low", status: "Pending", rep: "Kavya Shah", repInitials: "KS", deal: "FinPlex CRM Setup" },
  { id: 3, type: "Email", subject: "Send revised proposal to GreenPath", company: "GreenPath Solutions", dueDate: "2025-03-01", priority: "High", status: "Pending", rep: "Meena Reddy", repInitials: "MR", deal: "GreenPath Consulting Module" },
  { id: 4, type: "Meeting", subject: "Demo call - EduLeap", company: "EduLeap Foundation", dueDate: "2025-03-02", priority: "Medium", status: "Pending", rep: "Aditya Kumar", repInitials: "AK", deal: "EduLeap Learning Platform" },
  { id: 5, type: "Follow-up", subject: "Check in with TechNova renewal", company: "TechNova Pvt Ltd", dueDate: "2025-03-15", priority: "Medium", status: "Pending", rep: "Vikram Joshi", repInitials: "VJ", deal: "TechNova Enterprise License" },
];

const initialActivityForm = {
  activityType: "Call",
  date: "",
  subject: "",
  company: "",
  duration: "0",
  callOutcome: "—",
  rep: "Priya Nair",
  linkedDeal: "— None —",
  linkedContact: "— None —",
  callRecording: "",
  notes: "",
  scheduleFollowUp: "",
  followUpType: "Call",
};

const initialTaskForm = { type: "Call", subject: "", company: "", dueDate: "", priority: "Medium", status: "Pending", rep: "Priya Nair", deal: "" };

export default function AdminActivityLogPage() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [followUpTasks, setFollowUpTasks] = useState(INITIAL_FOLLOWUP_TASKS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [taskSearch, setTaskSearch] = useState("");
  const [activeTab, setActiveTab] = useState("log"); // "log" | "followups"
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activityForm, setActivityForm] = useState(initialActivityForm);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = activities.filter((row) => {
    const matchSearch =
      !search ||
      row.subject.toLowerCase().includes(search.toLowerCase()) ||
      row.company.toLowerCase().includes(search.toLowerCase()) ||
      row.dealLinked.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All Types" || row.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: activities.length,
    calls: activities.filter((a) => a.type === "Call").length,
    emails: activities.filter((a) => a.type === "Email").length,
    meetings: activities.filter((a) => a.type === "Meeting").length,
    overdueTasks: 5,
    pendingTasks: 5,
  };

  const filteredTasks = followUpTasks.filter(
    (row) =>
      !taskSearch ||
      row.subject.toLowerCase().includes(taskSearch.toLowerCase()) ||
      row.company.toLowerCase().includes(taskSearch.toLowerCase()) ||
      row.deal.toLowerCase().includes(taskSearch.toLowerCase())
  );

  const handleDelete = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    toast.success("Activity deleted");
  };

  const handleDeleteTask = (id) => {
    setFollowUpTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task deleted");
  };

  const openEditActivity = (row) => {
    setActivityForm({
      activityType: row.type || "Call",
      date: row.date ? row.date.split("-").reverse().join("-") : "",
      subject: row.subject || "",
      company: row.company || "",
      duration: row.duration || "0",
      callOutcome: row.outcome || "—",
      rep: row.rep || "Priya Nair",
      linkedDeal: row.dealLinked === "—" ? "— None —" : row.dealLinked || "— None —",
      linkedContact: "— None —",
      callRecording: row.recording || "",
      notes: row.subject || "",
      scheduleFollowUp: "",
      followUpType: "Call",
    });
    setEditingActivity(row);
    setAddModalOpen(true);
  };

  const openEditTask = (row) => {
    setEditingTask(row);
    setTaskForm({
      type: row.type || "Call",
      subject: row.subject || "",
      company: row.company || "",
      dueDate: row.dueDate || "",
      priority: row.priority || "Medium",
      status: row.status || "Pending",
      rep: row.rep || "Priya Nair",
      deal: row.deal || "",
    });
  };

  const handleTaskFormChange = (field, value) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTaskEdit = () => {
    if (!editingTask) return;
    const repEntry = REPS.find((r) => r.name === taskForm.rep) || REPS[0];
    setFollowUpTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? { ...t, ...taskForm, repInitials: repEntry.initials }
          : t
      )
    );
    setEditingTask(null);
    setTaskForm(initialTaskForm);
    toast.success("Task updated successfully");
  };

  const handleCompleteTask = (id) => {
    setFollowUpTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Done" } : t))
    );
  };

  const toYyyyMmDd = (ddMmYyyy) => {
    if (!ddMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(ddMmYyyy)) return ddMmYyyy || "";
    const [d, m, y] = ddMmYyyy.split("-");
    return `${y}-${m}-${d}`;
  };

  const handleActivityFormChange = (field, value) => {
    setActivityForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveActivity = () => {
    const { activityType, date, subject, company, duration, callOutcome, rep, linkedDeal, linkedContact, callRecording, notes, scheduleFollowUp, followUpType } = activityForm;
    if (!subject.trim() || !notes.trim()) return;
    const repEntry = REPS.find((r) => r.name === rep) || REPS[0];
    const activityDate = toYyyyMmDd(date) || new Date().toISOString().slice(0, 10);
    const dealLinked = linkedDeal === "— None —" ? "" : linkedDeal;
    const durationDisplay = duration && duration !== "0" ? `${duration}min` : "";
    const payload = {
      type: activityType,
      subject: subject.trim(),
      company: company.trim() || "—",
      outcome: callOutcome === "—" ? "" : callOutcome,
      duration: durationDisplay,
      rep: repEntry.name,
      repInitials: repEntry.initials,
      dealLinked: dealLinked || "—",
      date: activityDate,
      recording: callRecording.trim() || "",
    };
    if (editingActivity) {
      setActivities((prev) => prev.map((a) => (a.id === editingActivity.id ? { ...payload, id: a.id } : a)));
      setEditingActivity(null);
      toast.success("Activity updated successfully");
    } else {
      setActivities((prev) => [{ ...payload, id: Math.max(0, ...activities.map((a) => a.id)) + 1 }, ...prev]);
      toast.success("Activity logged successfully");
    }
    if (!editingActivity && scheduleFollowUp && toYyyyMmDd(scheduleFollowUp)) {
      const followUpDate = toYyyyMmDd(scheduleFollowUp);
      const newTask = {
        id: Math.max(0, ...followUpTasks.map((t) => t.id)) + 1,
        type: followUpType,
        subject: `Follow-up: ${subject.trim()}`,
        company: company.trim() || "—",
        dueDate: followUpDate,
        priority: "Medium",
        status: "Pending",
        rep: repEntry.name,
        repInitials: repEntry.initials,
        deal: dealLinked || "—",
      };
      setFollowUpTasks((prev) => [newTask, ...prev]);
    }
    setActivityForm(initialActivityForm);
    setAddModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setActivityForm(initialActivityForm);
    setEditingActivity(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Activity className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Activity Log</h1>
            <p className="text-[13px] text-black/70">Track activities and manage follow-up tasks in one place.</p>
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
          <button
            type="button"
            onClick={() => { setEditingActivity(null); setActivityForm(initialActivityForm); setAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Log Activity
          </button>
          <div className="relative pl-3 ml-1 border-l border-gray-200" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-3 rounded-lg py-1 pr-1 hover:bg-gray-50 transition" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{ADMIN_USER.initials}</div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{ADMIN_USER.initials}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate">{ADMIN_USER.name}</p>
                      <p className="text-xs font-medium text-black/70">{ADMIN_USER.role}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{ADMIN_USER.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-50 transition text-left">
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    My Profile
                  </button>
                  <button type="button" onClick={() => (window.location.href = "/")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left">
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
        {/* Six summary cards - same style as HR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{stats.total}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-blue-100 border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">Calls</p>
                <p className="text-2xl font-bold text-blue-900 tabular-nums tracking-tight">{stats.calls}</p>
                <p className="text-xs font-medium text-blue-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-blue-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-violet-100 border-2 border-violet-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1.5">Emails</p>
                <p className="text-2xl font-bold text-violet-900 tabular-nums tracking-tight">{stats.emails}</p>
                <p className="text-xs font-medium text-violet-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-violet-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-violet-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-amber-100 border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Meetings</p>
                <p className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight">{stats.meetings}</p>
                <p className="text-xs font-medium text-amber-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarDays className="w-6 h-6 text-amber-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-red-100 border-2 border-red-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-900 tabular-nums tracking-tight">{stats.overdueTasks}</p>
                <p className="text-xs font-medium text-red-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertCircle className="w-6 h-6 text-red-700" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-emerald-100 border-2 border-emerald-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">Pending Tasks</p>
                <p className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight">{stats.pendingTasks}</p>
                <p className="text-xs font-medium text-emerald-700/80 mt-1.5">Count</p>
              </div>
              <span className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle className="w-6 h-6 text-emerald-700" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("log")}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === "log"
                  ? "text-brand border-brand"
                  : "text-body border-transparent hover:text-brand-dark"
              }`}
            >
              <FileText className="w-4 h-4" strokeWidth={2} />
              Activity Log
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("followups")}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === "followups"
                  ? "text-brand border-brand"
                  : "text-body border-transparent hover:text-brand-dark"
              }`}
            >
              <Clock className="w-4 h-4" strokeWidth={2} />
              Follow-up Tasks
            </button>
          </div>
        </div>

        {activeTab === "log" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  placeholder="Search activities..."
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
                  <option>Call</option>
                  <option>Email</option>
                  <option>Meeting</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-max min-w-[1000px] text-sm table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-black">S.No</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Type</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Subject</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Outcome</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Duration</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Rep</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Deal Linked</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Date</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Recording</th>
                    <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.subject}>{row.subject}</td>
                      <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                      <td className="py-3 px-3 text-body">{row.outcome || "—"}</td>
                      <td className="py-3 px-3 text-body tabular-nums">{row.duration || "—"}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                            {row.repInitials}
                          </span>
                          <span className="text-body truncate min-w-0" title={row.rep}>{row.rep}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-body truncate" title={row.dealLinked}>{row.dealLinked}</td>
                      <td className="py-3 px-3 text-body tabular-nums whitespace-nowrap">{row.date}</td>
                      <td className="py-3 px-3 text-body truncate" title={row.recording}>{row.recording || "—"}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditActivity(row)}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                            aria-label="Edit activity"
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                            aria-label="Delete activity"
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
              <div className="py-12 text-center text-body text-sm">No activities match your filters.</div>
            )}
          </div>
        )}

        {activeTab === "followups" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-base font-semibold text-brand-dark">Follow-up Tasks</h2>
              <div className="flex items-center gap-2">
                <input
                  type="search"
                  placeholder="Search tasks..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  Add Task
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-max min-w-[900px] text-sm table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-black">S.No</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Type</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Subject</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Company</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Due Date</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Priority</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Status</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Rep</th>
                    <th className="text-left py-3 px-3 font-semibold text-black">Deal</th>
                    <th className="text-center py-3 px-3 font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3 text-body tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.subject}>{row.subject}</td>
                      <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                      <td className="py-3 px-3 font-medium text-danger tabular-nums whitespace-nowrap">{row.dueDate}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[row.priority] || "bg-gray-100 text-gray-700"}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-8 h-8 rounded-full bg-[#4A6FB3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                            {row.repInitials}
                          </span>
                          <span className="text-body truncate min-w-0" title={row.rep}>{row.rep}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-body truncate" title={row.deal}>{row.deal}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCompleteTask(row.id)}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-emerald-50 hover:text-success transition"
                            aria-label="Mark complete"
                            title="Mark complete"
                          >
                            <Check className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditTask(row)}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                            aria-label="Edit task"
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(row.id)}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-red-50 hover:text-danger transition"
                            aria-label="Delete task"
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
            {filteredTasks.length === 0 && (
              <div className="py-12 text-center text-body text-sm">No follow-up tasks match your search.</div>
            )}
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddModal} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-brand-dark">{editingActivity ? "Edit Activity" : "Log Activity"}</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-6">
              {/* Activity Details */}
              <div>
                <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Activity Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Activity type *</label>
                    <select
                      value={activityForm.activityType}
                      onChange={(e) => handleActivityFormChange("activityType", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {ACTIVITY_TYPES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Date *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={activityForm.date}
                        onChange={(e) => handleActivityFormChange("date", e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Subject *</label>
                    <input
                      type="text"
                      value={activityForm.subject}
                      onChange={(e) => handleActivityFormChange("subject", e.target.value)}
                      placeholder="Brief activity title"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                    <input
                      type="text"
                      value={activityForm.company}
                      onChange={(e) => handleActivityFormChange("company", e.target.value)}
                      placeholder="Company name"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Duration (mins)</label>
                    <input
                      type="text"
                      value={activityForm.duration}
                      onChange={(e) => handleActivityFormChange("duration", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Call outcome</label>
                    <select
                      value={activityForm.callOutcome}
                      onChange={(e) => handleActivityFormChange("callOutcome", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {CALL_OUTCOMES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Rep</label>
                    <select
                      value={activityForm.rep}
                      onChange={(e) => handleActivityFormChange("rep", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {REPS.map((r) => (
                        <option key={r.initials} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked deal</label>
                    <select
                      value={activityForm.linkedDeal}
                      onChange={(e) => handleActivityFormChange("linkedDeal", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {LINKED_DEALS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Linked contact</label>
                    <select
                      value={activityForm.linkedContact}
                      onChange={(e) => handleActivityFormChange("linkedContact", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {LINKED_CONTACTS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Call recording (filename)</label>
                    <input
                      type="text"
                      value={activityForm.callRecording}
                      onChange={(e) => handleActivityFormChange("callRecording", e.target.value)}
                      placeholder="call-recording-01.mp3"
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Notes *</label>
                    <textarea
                      value={activityForm.notes}
                      onChange={(e) => handleActivityFormChange("notes", e.target.value)}
                      placeholder="Notes"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-y min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
              {/* Follow-up Task */}
              <div>
                <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4 border-b border-brand/30 pb-2">Follow-up Task</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Schedule follow-up</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={activityForm.scheduleFollowUp}
                        onChange={(e) => handleActivityFormChange("scheduleFollowUp", e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Follow-up type</label>
                    <select
                      value={activityForm.followUpType}
                      onChange={(e) => handleActivityFormChange("followUpType", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm appearance-none cursor-pointer pr-10"
                    >
                      {FOLLOW_UP_TYPES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveActivity}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingActivity ? "Save changes" : "Save Activity"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setEditingTask(null); setTaskForm(initialTaskForm); }} aria-hidden />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">Edit Task</h2>
              <button type="button" onClick={() => { setEditingTask(null); setTaskForm(initialTaskForm); }} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="Close">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Type</label>
                <select value={taskForm.type} onChange={(e) => handleTaskFormChange("type", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm appearance-none cursor-pointer pr-10">
                  {FOLLOW_UP_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" value={taskForm.subject} onChange={(e) => handleTaskFormChange("subject", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Company</label>
                <input type="text" value={taskForm.company} onChange={(e) => handleTaskFormChange("company", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Due Date</label>
                <input type="text" value={taskForm.dueDate} onChange={(e) => handleTaskFormChange("dueDate", e.target.value)} placeholder="yyyy-mm-dd" className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Priority</label>
                  <select value={taskForm.priority} onChange={(e) => handleTaskFormChange("priority", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm appearance-none cursor-pointer pr-10">
                    {["High", "Medium", "Low"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Status</label>
                  <select value={taskForm.status} onChange={(e) => handleTaskFormChange("status", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm appearance-none cursor-pointer pr-10">
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Rep</label>
                <select value={taskForm.rep} onChange={(e) => handleTaskFormChange("rep", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm appearance-none cursor-pointer pr-10">
                  {REPS.map((r) => <option key={r.initials} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1.5">Deal</label>
                <input type="text" value={taskForm.deal} onChange={(e) => handleTaskFormChange("deal", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button type="button" onClick={() => { setEditingTask(null); setTaskForm(initialTaskForm); }} className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition">Cancel</button>
              <button type="button" onClick={handleSaveTaskEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-brand-blue transition">
                <Save className="w-4 h-4" strokeWidth={2} />
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
