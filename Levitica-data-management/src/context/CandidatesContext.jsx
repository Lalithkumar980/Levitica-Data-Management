import React, { createContext, useContext, useState } from "react";

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

const CandidatesContext = createContext(null);

export function CandidatesProvider({ children }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  return (
    <CandidatesContext.Provider value={{ candidates, setCandidates }}>
      {children}
    </CandidatesContext.Provider>
  );
}

export function useCandidates() {
  const ctx = useContext(CandidatesContext);
  if (!ctx) {
    throw new Error("useCandidates must be used within CandidatesProvider");
  }
  return ctx;
}

export { INITIAL_CANDIDATES };
