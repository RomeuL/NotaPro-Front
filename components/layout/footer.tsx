"use client";

import { useState, useEffect } from "react";
import { BarChart3, DollarSign, PiggyBank, FileCheck, Clock, Info } from "lucide-react";
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
    <footer className="border-t bg-white py-4 shadow-inner">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-7xl mx-auto px-4">
        <p className="text-sm leading-loose text-gray-600">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-[#1a365d]">NotaPro</span>.
        </p>

        {!isLoading && !error && stats && (
          <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-5 text-xs text-gray-700 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-blue-50 py-1 px-2 rounded-md">
              <FileCheck className="h-3 w-3 text-[#1a365d]" />
              <div className="flex flex-col">
                <span className="font-medium">Total de Notas</span>
                <span className="font-bold">{stats.totalNotas}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-yellow-50 py-1 px-2 rounded-md">
              <Clock className="h-3 w-3 text-yellow-600" />
              <div className="flex flex-col">
                <span className="font-medium">Notas Pendentes</span>
                <span className="font-bold">{stats.notasPendentes}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-green-50 py-1 px-2 rounded-md">
              <FileCheck className="h-3 w-3 text-green-600" />
              <div className="flex flex-col">
                <span className="font-medium">Notas Pagas</span>
                <span className="font-bold">{stats.notasPagas}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-indigo-50 py-1 px-2 rounded-md">
              <BarChart3 className="h-3 w-3 text-indigo-600" />
              <div className="flex flex-col">
                <span className="font-medium">Valor Total</span>
                <span className="font-bold">{formatCurrency(stats.valorTotalNotas)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-orange-50 py-1 px-2 rounded-md">
              <PiggyBank className="h-3 w-3 text-orange-600" />
              <div className="flex flex-col">
                <span className="font-medium">Valor Pendente</span>
                <span className="font-bold">{formatCurrency(stats.valorTotalPendente)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-emerald-50 py-1 px-2 rounded-md">
              <DollarSign className="h-3 w-3 text-emerald-600" />
              <div className="flex flex-col">
                <span className="font-medium">Valor Pago</span>
                <span className="font-bold">{formatCurrency(stats.valorTotalPago)}</span>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-xs bg-gray-50 py-1 px-3 rounded-md animate-pulse flex items-center">
            <div className="h-2 w-2 bg-[#1a365d] rounded-full mr-2 animate-ping"></div>
            Carregando estatísticas...
          </div>
        )}

        {error && (
          <div className="text-xs text-white bg-red-500 py-1 px-3 rounded-md flex items-center">
            <Info className="h-3 w-3 mr-1" />
            {error}
          </div>
        )}
      </div>
    </footer>
  )
}