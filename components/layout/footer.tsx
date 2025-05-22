"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";

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

export function Footer() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/estatisticas/notas");
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
        setError("Falha ao carregar estatísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t py-4">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm leading-loose text-muted-foreground px-2 md:pl-0">
          &copy; {new Date().getFullYear()} NotaPro.
        </p>

        {!isLoading && !error && stats && (
          <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-6 text-xs text-muted-foreground w-full md:w-auto md:pr-0">
            <div className="flex flex-col items-end">
              <span className="font-semibold">Total de Notas</span>
              <span>{stats.totalNotas}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">Notas Pendentes</span>
              <span>{stats.notasPendentes}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">Notas Pagas</span>
              <span>{stats.notasPagas}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">Valor Total</span>
              <span>{formatCurrency(stats.valorTotalNotas)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">Valor Pendente</span>
              <span>{formatCurrency(stats.valorTotalPendente)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">Valor Pago</span>
              <span>{formatCurrency(stats.valorTotalPago)}</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-xs text-muted-foreground animate-pulse md:ml-auto md:pr-0">
            Carregando estatísticas...
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive md:ml-auto md:pr-0">
            {error}
          </div>
        )}
      </div>
    </footer>
  )
}