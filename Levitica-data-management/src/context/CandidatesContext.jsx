import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const CandidatesContext = createContext(null);

export function CandidatesProvider({ children }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest("/api/candidates");
      setCandidates(Array.isArray(data.candidates) ? data.candidates : []);
    } catch (err) {
      setError(err.message || "Failed to load candidates");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const value = {
    candidates,
    setCandidates,
    loading,
    error,
    refreshCandidates: fetchCandidates,
  };

  return (
    <CandidatesContext.Provider value={value}>
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
