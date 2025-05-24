"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import api from "@/lib/api";

interface SystemStats {
  totalNotas: number;
  notasPendentes: number;
  notasPagas: number;
  valorTotalNotas: number;
  valorTotalPendente: number;
  valorTotalPago: number;
  valorMedioPorNota: number;
  totalEmpresas: number;
}

interface StatisticsContextType {
  stats: SystemStats | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export function StatisticsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/estatisticas/notas");
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
      setError("Falha ao carregar estatísticas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <StatisticsContext.Provider value={{ stats, isLoading, error, refreshStats }}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error("useStatistics must be used within a StatisticsProvider");
  }
  return context;
}