import React, { useState, useEffect } from "react";
import { Bell, ClipboardList, Plus, Pencil, Trash2, X, Save, CheckSquare, ListTodo, Calendar, Phone, Mail, AlertCircle } from "lucide-react";

const inputClass =
  "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function LogActivityModal({ open, onClose, onSave, onSaveFollowUpTask, activity: editingActivity }) {
  const [form, setForm] = useState({
    type: "Call",
    date: new Date().toISOString().slice(0, 10),
    subject: "",
    company: "",
    duration: "0",
    outcome: "",
    rep: "Vikram Joshi",
    deal: "",
    contact: "",
    recording: "",
    notes: "",
    scheduleFollowUp: "",
    followUpType: "Call",
  });

  useEffect(() => {
    if (!open) return;
    if (editingActivity) {
      const dur = editingActivity.duration === "-" ? "0" : String(editingActivity.duration).replace(/\D/g, "") || "0";
      setForm({
        type: editingActivity.type || "Call",
        date: editingActivity.date || new Date().toISOString().slice(0, 10),
        subject: editingActivity.subject || "",
        company: editingActivity.company === "-" ? "" : (editingActivity.company || ""),
        duration: dur,
        outcome: editingActivity.outcome === "-" ? "" : (editingActivity.outcome || ""),
        rep: editingActivity.rep || "Vikram Joshi",
        deal: editingActivity.dealLinked === "-" ? "" : (editingActivity.dealLinked || ""),
        contact: "",
        recording: editingActivity.recording === "-" ? "" : (editingActivity.recording || ""),
        notes: editingActivity.description || "",
        scheduleFollowUp: "",
        followUpType: "Call",
      });
    } else {
      setForm({
        type: "Call",
        date: new Date().toISOString().slice(0, 10),
        subject: "",
        company: "",
        duration: "0",
        outcome: "",
        rep: "Vikram Joshi",
        deal: "",
        contact: "",
        recording: "",
        notes: "",
        scheduleFollowUp: "",
        followUpType: "Call",
      });
    }
  }, [open, editingActivity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject?.trim() || !form.date || !form.notes?.trim()) return;
    const newActivity = {
      id: editingActivity?.id ?? Date.now(),
      type: form.type,
      subject: form.subject.trim(),
      description: form.notes?.trim() || "",
      company: form.company?.trim() || "-",
      outcome: form.outcome || "-",
      duration: form.duration ? `${form.duration}min` : "-",
      rep: form.rep,
      repInitials: getInitials(form.rep),
      dealLinked: form.deal || "-",
      date: form.date,
      recording: form.recording?.trim() || "-",
    };
    onSave(newActivity, !!editingActivity);

    if (!editingActivity && onSaveFollowUpTask && form.scheduleFollowUp) {
      const followUpTask = {
        id: Date.now() + 1,
        type: form.followUpType,
        subject: `Follow-up: ${form.subject.trim()}`,
        company: form.company?.trim() || "-",
        dueDate: form.scheduleFollowUp,
        priority: "Medium",
        status: "Pending",
        rep: form.rep,
        repInitials: getInitials(form.rep),
        deal: form.deal || "-",
      };
      onSaveFollowUpTask(followUpTask);
    }

    setForm({
      type: "Call",
      date: new Date().toISOString().slice(0, 10),
      subject: "",
      company: "",
      duration: "0",
      outcome: "",
      rep: "Vikram Joshi",
      deal: "",
      contact: "",
      recording: "",
      notes: "",
      scheduleFollowUp: "",
      followUpType: "Call",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingActivity ? "Edit Activity" : "Log Activity"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4">Activity Details</p>

          {/* Row 1: Activity Type, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Activity Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass} required>
                <option>Call</option>
                <option>Email</option>
                <option>Meeting</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date *</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass + " pr-10"}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Row 2: Subject (full width) */}
          <div className="mb-4">
            <label className={labelClass}>Subject *</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief activity title"
              className={inputClass}
              required
            />
          </div>

          {/* Row 3: Company, Duration */}
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
              <label className={labelClass}>Duration (Mins)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className={inputClass}
                min="0"
              />
            </div>
          </div>

          {/* Row 4: Call Outcome, Rep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Call Outcome</label>
              <select name="outcome" value={form.outcome} onChange={handleChange} className={inputClass}>
                <option value="">—</option>
                <option>Connected - Interested</option>
                <option>Callback Requested</option>
                <option>No Answer</option>
                <option>Not Interested</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Rep</label>
              <select name="rep" value={form.rep} onChange={handleChange} className={inputClass}>
                <option>Vikram Joshi</option>
                <option>Arjun Sharma</option>
              </select>
            </div>
          </div>

          {/* Row 5: Linked Deal, Linked Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Linked Deal</label>
              <select name="deal" value={form.deal} onChange={handleChange} className={inputClass}>
                <option value="">— None —</option>
                <option>Horizon Retail Integration</option>
                <option>TechNova Enterprise License</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Linked Contact</label>
              <select name="contact" value={form.contact} onChange={handleChange} className={inputClass}>
                <option value="">— None —</option>
                <option>Suresh Rajan</option>
                <option>Dev Malhotra</option>
              </select>
            </div>
          </div>

          {/* Row 6: Call Recording */}
          <div className="mb-4">
            <label className={labelClass}>Call Recording (Filename)</label>
            <input
              type="text"
              name="recording"
              value={form.recording}
              onChange={handleChange}
              placeholder="e.g. call-recording-01.mp3"
              className={inputClass}
            />
          </div>

          {/* Row 7: Notes */}
          <div className="mb-6">
            <label className={labelClass}>Notes *</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Activity notes..."
              className={inputClass + " min-h-[100px] resize-y"}
              required
            />
          </div>

          {/* Follow-Up Task Section */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-4">Follow-Up Task</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Schedule Follow-Up</label>
                <div className="relative">
                  <input
                    type="date"
                    name="scheduleFollowUp"
                    value={form.scheduleFollowUp}
                    onChange={handleChange}
                    className={inputClass + " pr-10"}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Follow-Up Type</label>
                <select name="followUpType" value={form.followUpType} onChange={handleChange} className={inputClass}>
                  <option>Call</option>
                  <option>Follow-up</option>
                  <option>Email</option>
                  <option>Meeting</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddTaskModal({ open, onClose, onSave, task: editingTask }) {
  const [form, setForm] = useState({
    type: "Call",
    dueDate: new Date().toISOString().slice(0, 10),
    subject: "",
    company: "",
    priority: "Medium",
    rep: "Vikram Joshi",
    deal: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    if (editingTask) {
      setForm({
        type: editingTask.type || "Call",
        dueDate: editingTask.dueDate || new Date().toISOString().slice(0, 10),
        subject: editingTask.subject || "",
        company: editingTask.company === "-" ? "" : (editingTask.company || ""),
        priority: editingTask.priority || "Medium",
        rep: editingTask.rep || "Vikram Joshi",
        deal: editingTask.deal === "-" ? "" : (editingTask.deal || ""),
        notes: "",
      });
    } else {
      setForm({
        type: "Call",
        dueDate: new Date().toISOString().slice(0, 10),
        subject: "",
        company: "",
        priority: "Medium",
        rep: "Vikram Joshi",
        deal: "",
        notes: "",
      });
    }
  }, [open, editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject?.trim() || !form.dueDate) return;
    const newTask = {
      id: editingTask?.id ?? Date.now(),
      type: form.type,
      subject: form.subject.trim(),
      company: form.company?.trim() || "-",
      dueDate: form.dueDate,
      priority: form.priority,
      status: editingTask?.status ?? "Pending",
      rep: form.rep,
      repInitials: getInitials(form.rep),
      deal: form.deal || "-",
    };
    onSave(newTask, !!editingTask);
    setForm({
      type: "Call",
      dueDate: new Date().toISOString().slice(0, 10),
      subject: "",
      company: "",
      priority: "Medium",
      rep: "Vikram Joshi",
      deal: "",
      notes: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">{editingTask ? "Edit Task" : "Add Follow-up Task"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Row 1: Task Type, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Task Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option>Call</option>
                <option>Follow-up</option>
                <option>Email</option>
                <option>Meeting</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Due Date *</label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={inputClass + " pr-10"}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Row 2: Subject (full width) */}
          <div className="mb-4">
            <label className={labelClass}>Subject *</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Task description"
              className={inputClass}
              required
            />
          </div>

          {/* Row 3: Company, Priority */}
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
              <label className={labelClass}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Row 4: Rep, Linked Deal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className={labelClass}>Rep</label>
              <select name="rep" value={form.rep} onChange={handleChange} className={inputClass}>
                <option>Vikram Joshi</option>
                <option>Arjun Sharma</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Linked Deal</label>
              <select name="deal" value={form.deal} onChange={handleChange} className={inputClass}>
                <option value="">— None —</option>
                <option>Horizon Retail Integration</option>
                <option>TechNova Enterprise License</option>
              </select>
            </div>
          </div>

          {/* Row 5: Notes */}
          <div className="mb-6">
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes..."
              className={inputClass + " min-h-[100px] resize-y"}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-body hover:bg-gray-50 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const TYPE_STYLES = {
  Call: "bg-teal-100 text-teal-700",
  Email: "bg-amber-100 text-amber-700",
  Meeting: "bg-orange-100 text-orange-700",
  "Follow-up": "bg-blue-100 text-blue-700",
};

const PRIORITY_STYLES = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-700",
};

const TASK_STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Completed: "bg-success/15 text-success",
  Overdue: "bg-pink-100 text-pink-700",
};

const INITIAL_TASKS = [
  {
    id: 1,
    type: "Call",
    subject: "Follow-up call with Horizon Retail",
    company: "Horizon Retail Co",
    dueDate: "2025-02-28",
    priority: "High",
    status: "Pending",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    deal: "Horizon Retail Integration",
  },
  {
    id: 2,
    type: "Follow-up",
    subject: "Check in with TechNova renewal",
    company: "TechNova Pvt Ltd",
    dueDate: "2025-03-15",
    priority: "Medium",
    status: "Pending",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    deal: "TechNova Enterprise License",
  },
];

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    type: "Call",
    subject: "Negotiation Call - Horizon",
    description: "Discussed 10% volume discount. VP confirmed will c...",
    company: "Horizon Retail Co",
    outcome: "Callback Requested",
    duration: "18min",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    dealLinked: "Horizon Retail Integration",
    date: "2025-02-18",
    recording: "-",
  },
  {
    id: 2,
    type: "Meeting",
    subject: "Product Demo - TechNova",
    description: "Demonstrated enterprise dashboard, CTO loved ther",
    company: "TechNova Pvt Ltd",
    outcome: "-",
    duration: "60min",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    dealLinked: "TechNova Enterprise License",
    date: "2025-01-18",
    recording: "-",
  },
  {
    id: 3,
    type: "Email",
    subject: "Proposal Follow-up Email",
    description: "Sent detailed pricing sheet and proposal document",
    company: "TechNova Pvt Ltd",
    outcome: "-",
    duration: "-",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    dealLinked: "TechNova Enterprise License",
    date: "2025-01-16",
    recording: "-",
  },
  {
    id: 4,
    type: "Call",
    subject: "Initial Discovery Call",
    description: "Client interested in enterprise plan. Budget con f...",
    company: "TechNova Pvt Ltd",
    outcome: "Connected - Interested",
    duration: "25min",
    rep: "Vikram Joshi",
    repInitials: "VJ",
    dealLinked: "TechNova Enterprise License",
    date: "2025-01-15",
    recording: "-",
  },
];

export default function ActivityLogPage() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("All Status");
  const [activeTab, setActiveTab] = useState("log");
  const [showLogModal, setShowLogModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const handleSaveActivity = (payload, isEdit) => {
    if (isEdit) {
      setActivities((prev) => prev.map((a) => (a.id === payload.id ? payload : a)));
    } else {
      setActivities((prev) => [payload, ...prev]);
    }
    setEditingActivity(null);
    setShowLogModal(false);
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSaveTask = (payload, isEdit) => {
    if (isEdit) {
      setTasks((prev) => prev.map((t) => (t.id === payload.id ? payload : t)));
    } else {
      setTasks((prev) => [payload, ...prev]);
    }
    setEditingTask(null);
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const filtered = activities.filter((row) => {
    const matchSearch =
      !search ||
      row.subject?.toLowerCase().includes(search.toLowerCase()) ||
      row.company?.toLowerCase().includes(search.toLowerCase()) ||
      row.dealLinked?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All Types" || row.type === typeFilter;
    return matchSearch && matchType;
  });

  const filteredTasks = tasks.filter((row) => {
    const matchSearch =
      !taskSearch ||
      row.subject?.toLowerCase().includes(taskSearch.toLowerCase()) ||
      row.company?.toLowerCase().includes(taskSearch.toLowerCase()) ||
      row.deal?.toLowerCase().includes(taskSearch.toLowerCase());
    const matchStatus = taskStatusFilter === "All Status" || row.status === taskStatusFilter;
    return matchSearch && matchStatus;
  });

  const today = new Date().toISOString().slice(0, 10);
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const overdueTasks = tasks.filter(
    (t) => t.status === "Pending" && t.dueDate !== "-" && t.dueDate < today
  ).length;

  const calls = activities.filter((a) => a.type === "Call").length;
  const emails = activities.filter((a) => a.type === "Email").length;
  const meetings = activities.filter((a) => a.type === "Meeting").length;

  const handleCompleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <ClipboardList className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Activity Log</h1>
            <p className="text-sm text-body leading-snug">Tasks, follow-ups, and activity history.</p>
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
            onClick={() => { setEditingActivity(null); setShowLogModal(true); }}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Log Activity
          </button>
        </div>
      </header>

      <LogActivityModal
        open={showLogModal}
        onClose={() => { setShowLogModal(false); setEditingActivity(null); }}
        onSave={handleSaveActivity}
        onSaveFollowUpTask={(t) => setTasks((prev) => [t, ...prev])}
        activity={editingActivity}
      />
      <AddTaskModal
        open={showAddTaskModal}
        onClose={() => { setShowAddTaskModal(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Summary cards - same style as Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="group rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-light/80 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-dark/80 uppercase tracking-wider mb-1.5">Total Activities</p>
                <p className="text-2xl font-bold text-brand-dark tabular-nums tracking-tight">{activities.length}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <ClipboardList className="w-5 h-5 text-brand" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider mb-1.5">Calls</p>
                <p className="text-2xl font-bold text-teal-700 tabular-nums tracking-tight">{calls}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-600/90 uppercase tracking-wider mb-1.5">Emails</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight">{emails}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 text-amber-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-orange-600/90 uppercase tracking-wider mb-1.5">Meetings</p>
                <p className="text-2xl font-bold text-orange-700 tabular-nums tracking-tight">{meetings}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-orange-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-orange-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-red-600/90 uppercase tracking-wider mb-1.5">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-700 tabular-nums tracking-tight">{overdueTasks}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />
              </span>
            </div>
          </div>
          <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider mb-1.5">Pending Tasks</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">{pendingTasks}</p>
                <p className="text-xs text-gray-500 mt-1.5">Count</p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("log")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "log" ? "bg-brand text-white" : "bg-white border border-gray-200 text-body hover:bg-gray-50"
            }`}
          >
            Activity Log
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "tasks" ? "bg-brand text-white" : "bg-white border border-gray-200 text-body hover:bg-gray-50"
            }`}
          >
            Follow-up Tasks
          </button>
        </div>

        {/* Activity Log / Follow-up Tasks table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-brand-dark flex items-center gap-2">
              {activeTab === "log" ? (
                <>
                  <ClipboardList className="w-5 h-5 text-brand" strokeWidth={2} />
                  Activity Log
                </>
              ) : (
                <>
                  <ListTodo className="w-5 h-5 text-brand" strokeWidth={2} />
                  Follow-up Tasks
                </>
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {activeTab === "log" ? (
                <>
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
                </>
              ) : (
                <>
                  <input
                    type="search"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand w-52"
                  />
                  <select
                    value={taskStatusFilter}
                    onChange={(e) => setTaskStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-brand-soft border border-gray-200 text-sm text-body focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer pr-8"
                  >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Overdue</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => { setEditingTask(null); setShowAddTaskModal(true); }}
                    className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Add Task
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === "log" ? (
              <table className="w-max min-w-[1000px] text-sm table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-right py-3 px-3 font-semibold text-gray-600">#</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Subject</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Outcome</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600">Duration</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Rep</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Deal Linked</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Recording</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3 text-right text-body tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="min-w-0">
                          <p className="font-medium text-brand-dark truncate" title={row.subject}>{row.subject}</p>
                          {row.description && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate" title={row.description}>{row.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                      <td className="py-3 px-3 text-body truncate" title={row.outcome}>{row.outcome}</td>
                      <td className="py-3 px-3 text-center text-body tabular-nums">{row.duration}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                            {row.repInitials}
                          </span>
                          <span className="text-body truncate" title={row.rep}>{row.rep}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-body truncate" title={row.dealLinked}>{row.dealLinked}</td>
                      <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.date}</td>
                      <td className="py-3 px-3 text-body truncate" title={row.recording}>{row.recording}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => { setEditingActivity(row); setShowLogModal(true); }}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-brand-soft hover:text-brand transition"
                            aria-label="Edit activity"
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(row.id)}
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
            ) : (
              <table className="w-max min-w-[900px] text-sm table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-right py-3 px-3 font-semibold text-gray-600">#</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Subject</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600">Due Date</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Priority</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Rep</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600">Deal</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3 text-right text-body tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            TYPE_STYLES[row.type] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-brand-dark truncate" title={row.subject}>{row.subject}</td>
                      <td className="py-3 px-3 text-body truncate" title={row.company}>{row.company}</td>
                      <td className="py-3 px-3 text-center text-body tabular-nums whitespace-nowrap">{row.dueDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            PRIORITY_STYLES[row.priority] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            TASK_STATUS_STYLES[row.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs shrink-0">
                            {row.repInitials}
                          </span>
                          <span className="text-body truncate" title={row.rep}>{row.rep}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-body truncate" title={row.deal}>{row.deal}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCompleteTask(row.id)}
                            className="inline-flex p-2 rounded-lg text-body hover:bg-gray-100 hover:text-success transition"
                            aria-label="Mark complete"
                          >
                            <CheckSquare className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingTask(row); setShowAddTaskModal(true); }}
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
            )}
          </div>
          {activeTab === "log" && filtered.length === 0 && (
            <div className="py-12 text-center text-body text-sm">No activities match your filters.</div>
          )}
          {activeTab === "tasks" && filteredTasks.length === 0 && (
            <div className="py-12 text-center text-body text-sm">No tasks match your filters.</div>
          )}
        </div>
      </div>
    </>
  );
}
