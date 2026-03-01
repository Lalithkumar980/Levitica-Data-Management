import React, { useState } from "react";
import { Bell, Search, UserPlus, X, Save, Calendar, Pencil } from "lucide-react";

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const INITIAL_CANDIDATES = [
  {
    id: 1,
    name: "Rohan Mehta",
    note: "Excellent technical skills",
    position: "Backend Developer",
    dept: "Engineering",
    interviewDate: "2025-01-10",
    came: "Yes",
    screening: "Pass",
    technical: "Pass / Virtual",
    hrRound: "Pass",
    offer: "Done",
    onboarding: "Completed",
    joiningDate: "2025-02-01",
    referredBy: { initials: "AV", name: "Amit Verma", phone: "9876543210" },
    recruiter: { initials: "PN", name: "Priya Nair" },
  },
  {
    id: 2,
    name: "Deepak Rao",
    note: null,
    position: "HR Executive",
    dept: "HR",
    interviewDate: "2025-01-18",
    came: "Yes",
    screening: "Pass",
    technical: "Pass / Virtual",
    hrRound: "Pass",
    offer: "Done",
    onboarding: "In Progress",
    joiningDate: "2025-03-01",
    referredBy: { initials: "KS", name: "Kavita Singh", phone: "9123456780" },
    recruiter: { initials: "PN", name: "Priya Nair" },
  },
  {
    id: 3,
    name: "Pooja Menon",
    note: "Final HR round scheduled",
    position: "Product Manager",
    dept: "Product",
    interviewDate: "2025-02-05",
    came: "Yes",
    screening: "Pass",
    technical: "Pass / Virtual",
    hrRound: "Pending",
    offer: "Pending",
    onboarding: null,
    joiningDate: null,
    referredBy: null,
    recruiter: { initials: "PN", name: "Priya Nair" },
  },
];

const Badge = ({ children, variant = "success" }) => {
  const classes = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${classes[variant] || classes.success}`}>
      {children}
    </span>
  );
};

/** Returns 6 segment colors for pipeline: success (done), info (in progress), warning (pending), gray (not started) */
function getPipelineSegments(c) {
  const done = "bg-success";
  const current = "bg-info";
  const pending = "bg-warning";
  const none = "bg-gray-300";
  return [
    c.screening === "Pass" ? done : c.screening ? pending : none,
    c.technical && c.technical !== "Not Yet" ? done : none,
    c.hrRound === "Pass" ? done : c.hrRound === "Pending" ? pending : none,
    c.offer === "Done" ? done : c.offer === "Pending" ? pending : none,
    c.onboarding === "Completed" ? done : c.onboarding === "In Progress" ? current : none,
    c.joiningDate ? done : none,
  ];
}

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-brand-soft border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-body uppercase tracking-wider mb-1.5";

const defaultForm = {
  fullName: "",
  positionApplied: "",
  department: "",
  interviewDate: "",
  cameForInterview: "",
  recruiter: "Priya Nair",
  screeningCall: "Not Yet",
  technicalRound: "Not Yet",
  techRoundType: "",
  hrRound: "Not Yet",
  salary: "",
  offerStatus: "",
};

function AddCandidateModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(defaultForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recruiterName = form.recruiter || "Priya Nair";
    const technicalDisplay =
      form.technicalRound === "Not Yet"
        ? "Not Yet"
        : form.techRoundType
          ? `${form.technicalRound} / ${form.techRoundType}`
          : form.technicalRound;
    const newCandidate = {
      id: Date.now(),
      name: form.fullName.trim(),
      note: null,
      position: form.positionApplied.trim(),
      dept: form.department.trim() || "—",
      interviewDate: form.interviewDate || "—",
      came: form.cameForInterview || "—",
      screening: form.screeningCall,
      technical: technicalDisplay,
      hrRound: form.hrRound,
      offer: form.offerStatus || "—",
      onboarding: form.offerStatus === "Done" ? "In Progress" : null,
      joiningDate: null,
      referredBy: null,
      recruiter: { initials: getInitials(recruiterName), name: recruiterName },
    };
    onSave(newCandidate);
    setForm(defaultForm);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-brand-dark">Add Candidate</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* CANDIDATE INFORMATION */}
          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Candidate Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Candidate full name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Position Applied *</label>
                <input
                  type="text"
                  name="positionApplied"
                  value={form.positionApplied}
                  onChange={handleChange}
                  placeholder="e.g. Senior Developer"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Interview Date</label>
                <div className="relative">
                  <input
                    type="text"
                    name="interviewDate"
                    value={form.interviewDate}
                    onChange={handleChange}
                    placeholder="dd-mm-yyyy"
                    className={inputClass}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Came for Interview?</label>
                <select name="cameForInterview" value={form.cameForInterview} onChange={handleChange} className={inputClass}>
                  <option value="">—</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Recruiter</label>
                <select name="recruiter" value={form.recruiter} onChange={handleChange} className={inputClass}>
                  <option value="Priya Nair">Priya Nair</option>
                  <option value="Arjun Sharma">Arjun Sharma</option>
                </select>
              </div>
            </div>
          </div>

          {/* ROUND RESULTS */}
          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Round Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Screening Call</label>
                <select name="screeningCall" value={form.screeningCall} onChange={handleChange} className={inputClass}>
                  <option value="Not Yet">Not Yet</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Technical Round</label>
                <select name="technicalRound" value={form.technicalRound} onChange={handleChange} className={inputClass}>
                  <option value="Not Yet">Not Yet</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tech Round Type</label>
                <select name="techRoundType" value={form.techRoundType} onChange={handleChange} className={inputClass}>
                  <option value="">—</option>
                  <option value="Virtual">Virtual</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>HR Round</label>
                <select name="hrRound" value={form.hrRound} onChange={handleChange} className={inputClass}>
                  <option value="Not Yet">Not Yet</option>
                  <option value="Pass">Pass</option>
                  <option value="Pending">Pending</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            </div>
          </div>

          {/* OFFER & ONBOARDING */}
          <div>
            <h3 className="text-sm font-semibold text-brand mb-4">Offer & Onboarding</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Salary (LPA / Amount)</label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 9.5 LPA or ₹85,000/mo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Offer Status</label>
                <select name="offerStatus" value={form.offerStatus} onChange={handleChange} className={inputClass}>
                  <option value="">—</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-body font-medium hover:bg-gray-100 transition">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition">
              <Save className="w-4 h-4" strokeWidth={2} />
              Save Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyCandidates() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddCandidate = (newCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-brand-dark">Recruitment</h1>
          <p className="text-sm text-body">Candidate Tracker</p>
        </div>
        <div className="flex items-center gap-3">
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
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
          >
            <UserPlus className="w-5 h-5" strokeWidth={2} />
            Add Candidate
          </button>
        </div>
      </header>

      <AddCandidateModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddCandidate} />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {/* Summary cards - same style as HR Dashboard / Activity Log */}
        {(() => {
          const total = candidates.length;
          const came = candidates.filter((c) => c.came === "Yes").length;
          const offersDone = candidates.filter((c) => c.offer === "Done").length;
          const offerPending = candidates.filter((c) => c.offer === "Pending").length;
          const joined = candidates.filter((c) => c.onboarding === "Completed").length;
          const rejected = candidates.filter((c) => c.offer === "Rejected").length;
          const cameRate = total ? Math.round((came / total) * 100) : 0;
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm border-l-4 border-l-brand">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                <p className="text-lg font-bold text-brand-dark">{total}</p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm border-l-4 border-l-teal-500">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Came for Interview</p>
                <p className="text-lg font-bold text-teal-600">{came}</p>
                <p className="text-xs text-gray-500 mt-0.5">{cameRate}% rate</p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Offers Done</p>
                <p className="text-lg font-bold text-emerald-600">{offersDone}</p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm border-l-4 border-l-orange-500">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Offer Pending</p>
                <p className="text-lg font-bold text-orange-600">{offerPending}</p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm border-l-4 border-l-violet-500">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Joined</p>
                <p className="text-lg font-bold text-violet-600">{joined}</p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm border-l-4 border-l-rose-500">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Rejected</p>
                <p className="text-lg font-bold text-rose-600">{rejected}</p>
              </div>
            </div>
          );
        })()}

        {/* All Candidates table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-brand-dark">All Candidates</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search name, position, r..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>All Stages</option>
              </select>
              <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>All Offers</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">S.no</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Candidate</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Position / Dept</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Interview Date</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Came</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Screening</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Technical</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">HR Round</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Offer</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Onboarding</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Joining Date</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Referred By</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Recruiter</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Pipeline</th>
                  <th className="px-4 py-4 text-left font-semibold text-body uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-4 text-body whitespace-nowrap">{i + 1}</td>
                    <td className="px-4 py-4 max-w-[220px]">
                      <span className="font-medium text-brand-dark block truncate" title={c.name}>{c.name}</span>
                      {c.note && <span className="text-xs text-body block truncate mt-0.5" title={c.note}>{c.note}</span>}
                    </td>
                    <td className="px-4 py-4 max-w-[180px]">
                      <span className="font-medium text-brand-dark block truncate" title={c.position}>{c.position}</span>
                      <span className="text-xs text-body block truncate mt-0.5" title={c.dept}>{c.dept}</span>
                    </td>
                    <td className="px-4 py-4 text-body whitespace-nowrap">{c.interviewDate}</td>
                    <td className="px-4 py-4 whitespace-nowrap"><Badge>{c.came}</Badge></td>
                    <td className="px-4 py-4 whitespace-nowrap"><Badge>{c.screening}</Badge></td>
                    <td className="px-4 py-4 whitespace-nowrap"><Badge>{c.technical}</Badge></td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={c.hrRound === "Pending" ? "warning" : "success"}>{c.hrRound}</Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={c.offer === "Pending" ? "warning" : "success"}>{c.offer}</Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {c.onboarding ? (
                        <Badge variant={c.onboarding === "In Progress" ? "info" : "success"}>{c.onboarding}</Badge>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-body whitespace-nowrap">{c.joiningDate || "—"}</td>
                    <td className="px-4 py-4 max-w-[160px]">
                      {c.referredBy ? (
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success font-semibold text-[10px] shrink-0">{c.referredBy.initials}</span>
                          <span className="min-w-0">
                            <span className="font-medium text-brand-dark text-xs block truncate" title={c.referredBy.name}>{c.referredBy.name}</span>
                            <span className="text-body text-xs block truncate mt-0.5" title={c.referredBy.phone}>{c.referredBy.phone}</span>
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 max-w-[140px]">
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success font-semibold text-[10px] shrink-0">{c.recruiter.initials}</span>
                        <span className="font-medium text-brand-dark text-xs truncate" title={c.recruiter.name}>{c.recruiter.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {getPipelineSegments(c).map((color, idx) => (
                          <span key={idx} className={`w-2 h-5 rounded-sm shrink-0 ${color}`} title={["Screening", "Technical", "HR Round", "Offer", "Onboarding", "Joined"][idx]} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-warning hover:bg-warning/10 hover:border-warning/50 transition"
                        aria-label="Edit candidate"
                      >
                        <Pencil className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
