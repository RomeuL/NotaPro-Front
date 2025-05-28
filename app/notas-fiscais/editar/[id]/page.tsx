"use client";

import { useEffect, useState } from "react";
import FormNotaFiscalPage from "../../form";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { FileText, AlertCircle } from "lucide-react";

interface Invoice {
  id: number;
  descricao: string;
  empresaId: number;
  dataEmissao: string;
  dataVencimento: string;
  valor: number;
  tipoPagamento: "BOLETO" | "PIX" | "CARTAO_CREDITO" | "TRANSFERENCIA_BANCARIA" | "DINHEIRO";
  numeroBoleto: string | null;
  numeroNota: string;
  status: "PENDENTE" | "PAGO";
}

export default function EditarPage({ params }: { params: any }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Invoice>(`/notas/${params.id}`);
        setInvoice(response.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Falha ao carregar nota fiscal. Por favor, tente novamente.");
        setTimeout(() => router.push("/notas-fiscais"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-[#1a365d] text-white p-6 rounded-t-lg mb-6 shadow-md">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Editar Nota Fiscal</h1>
          </div>
        </div>
        
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[#1a365d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">Carregando dados da nota fiscal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-[#1a365d] text-white p-6 rounded-t-lg mb-6 shadow-md">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Editar Nota Fiscal</h1>
          </div>
        </div>
        
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-red-700 mb-6 max-w-lg mx-auto">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <p>{error}</p>
              <p className="text-sm mt-2">Redirecionando para a lista de notas fiscais...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return invoice ? <FormNotaFiscalPage notaFiscal={invoice} /> : null;
}
