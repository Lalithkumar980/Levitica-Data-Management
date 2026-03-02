import React, { useState } from "react";
import { Bell, Kanban, Plus, Filter, MoreVertical } from "lucide-react";
import AddDealModal from "./AddDealModal";

const STAGES = [
  { id: "Lead", label: "LEAD", borderColor: "border-gray-200" },
  { id: "Contacted", label: "CONTACTED", borderColor: "border-gray-200" },
  { id: "Demo", label: "DEMO", borderColor: "border-gray-200" },
  { id: "Proposal", label: "PROPOSAL", borderColor: "border-gray-200" },
  { id: "Negotiation", label: "NEGOTIATION", borderColor: "border-amber-400" },
  { id: "Won", label: "WON", borderColor: "border-success" },
  { id: "Lost", label: "LOST", borderColor: "border-danger" },
];

const INITIAL_DEALS = [
  {
    id: 1,
    company: "TechNova Pvt Ltd",
    dealValue: "₹8,50,000",
    contact: "Suresh Rajan",
    location: "Bangalore",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    expectedClose: "2025-01-15",
    stage: "Won",
  },
  {
    id: 2,
    company: "Horizon Retail Co",
    dealValue: "₹12,00,000",
    contact: "Dev Malhotra",
    location: "Delhi",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    expectedClose: "2025-03-20",
    stage: "Negotiation",
  },
  {
    id: 3,
    company: "SwiftLogix",
    dealValue: "₹1,80,000",
    contact: "Kavya Rao",
    location: "Chennai",
    owner: "Vikram Joshi",
    ownerInitials: "VJ",
    expectedClose: "2025-01-30",
    stage: "Lost",
  },
];

function DealCard({ deal }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition cursor-pointer">
      <p className="font-semibold text-brand-dark mb-1">{deal.company}</p>
      <p className="text-sm font-bold text-brand mb-2">{deal.dealValue}</p>
      <p className="text-xs text-body mb-2">{deal.contact} - {deal.location}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center text-brand font-semibold text-[10px]">
            {deal.ownerInitials}
          </span>
          <span className="text-xs text-body">{deal.owner}</span>
        </div>
        <span className="text-xs text-body">{deal.expectedClose}</span>
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [showAddDealModal, setShowAddDealModal] = useState(false);

  const dealsByStage = STAGES.reduce((acc, s) => {
    acc[s.id] = deals.filter((d) => d.stage === s.id);
    return acc;
  }, {});

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + (parseInt(d.dealValue.replace(/[₹,]/g, ""), 10) || 0), 0);
  const pipelineValue = "₹" + totalValue.toLocaleString("en-IN");

  const getStageTotal = (stageId) => {
    const stageDeals = dealsByStage[stageId] || [];
    return stageDeals.reduce((sum, d) => {
      const num = parseInt(d.dealValue.replace(/[₹,]/g, ""), 10) || 0;
      return sum + num;
    }, 0);
  };

  const formatStageAmount = (amt) => {
    if (amt === 0) return "₹0";
    return "₹" + amt.toLocaleString("en-IN");
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand shrink-0" aria-hidden>
            <Kanban className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-semibold text-brand-dark leading-tight">Kanban Board</h1>
            <p className="text-sm text-body leading-snug">Visual pipeline and deal stages.</p>
          </div>
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
            onClick={() => setShowAddDealModal(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Deal
          </button>
        </div>
      </header>

      <AddDealModal
        open={showAddDealModal}
        onClose={() => setShowAddDealModal(false)}
        onSave={(deal) => setDeals((prev) => [deal, ...prev])}
      />

      <div className="flex-1 min-h-0 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-brand" strokeWidth={2} />
            <h2 className="text-base font-semibold text-brand-dark">Kanban Pipeline</h2>
            <span className="text-sm text-body">{totalDeals} deals - {pipelineValue} inquiries</span>
          </div>
          <button
            type="button"
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm shadow-sm hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Deal
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
          {STAGES.map((stage) => {
            const stageDeals = dealsByStage[stage.id] || [];
            const count = stageDeals.length;
            const amount = getStageTotal(stage.id);
            return (
              <div
                key={stage.id}
                className={`flex-shrink-0 w-72 rounded-xl border-2 ${stage.borderColor} bg-gray-50/50 overflow-hidden flex flex-col`}
              >
                <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{stage.label}</p>
                    <p className="text-sm font-semibold text-brand-dark">
                      {count} · {formatStageAmount(amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Filter">
                      <Filter className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="More">
                      <MoreVertical className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {stageDeals.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No deals</p>
                  ) : (
                    stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
