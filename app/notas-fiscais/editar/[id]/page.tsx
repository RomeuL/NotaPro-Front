"use client";

import { useEffect, useState } from "react";
import FormNotaFiscalPage from "../../form";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface Invoice {
  id: number;
  descricao: string;
  empresaId: number;
  dataEmissao: string;
  dataVencimento: string;
  valor: number;
  tipoPagamento: "BOLETO" | "PIX" | "CARTAO_CREDITO" | "TRANSFERENCIA_BANCARIA" | "DINHEIRO";
  numeroBoleto: string | null;
  status: "PENDENTE" | "PAGO";
}

export default function EditarPage({ params }: { params: { id: string } }) {
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
      <div className="container mx-auto py-20 text-center">
        <p className="text-lg">Carregando dados da nota fiscal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20">
        <div className="bg-destructive/15 p-4 rounded-md text-destructive mb-6 max-w-lg mx-auto text-center">
          <p>{error}</p>
          <p className="text-sm mt-2">Redirecionando para a lista de notas fiscais...</p>
        </div>
      </div>
    );
  }

  return invoice ? <FormNotaFiscalPage notaFiscal={invoice} /> : null;
}
