"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, X, ChevronLeft, ChevronRight, CalendarIcon, CreditCard, CheckCircle2, Clock, AlertCircle, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { useStatistics } from "@/contexts/StatisticsContext";

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

interface Company {
  id: number;
  nome: string;
  cnpj: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export default function NotasFiscaisPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | "PENDENTE" | "PAGO">("TODOS");

  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 6;

  const { refreshStats } = useStatistics();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [invoicesResponse, companiesResponse] = await Promise.all([
        api.get("/notas"),
        api.get("/empresas")
      ]);
      
      setInvoices(invoicesResponse.data);
      setCompanies(companiesResponse.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Falha ao carregar dados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        setIsLoading(true);
        await api.delete(`/notas/${deleteId}`);
        setInvoices(invoices.filter((invoice) => invoice.id !== deleteId));
        await refreshStats();
        setError(null);
      } catch (err) {
        console.error("Error deleting invoice:", err);
        setError("Falha ao excluir nota fiscal. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
        setIsDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const getCompanyName = (empresaId: number): string => {
    const company = companies.find(c => c.id === empresaId);
    return company ? company.nome : "Empresa não encontrada";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== "TODOS" && invoice.status !== statusFilter) {
      return false;
    }
    
    if (!searchQuery.trim()) {
      return true;
    }
    
    const companyName = getCompanyName(invoice.empresaId);
    return (
      invoice.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const endIndex = Math.min(startIndex + invoicesPerPage, filteredInvoices.length);
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'PAGO':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" /> Pago</Badge>;
      case 'PENDENTE':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-400"><Clock className="mr-1 h-3 w-3" /> Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentType = (type: Invoice['tipoPagamento']) => {
    switch (type) {
      case 'BOLETO':
        return <span className="text-sm flex items-center text-muted-foreground"><CreditCard className="mr-1 h-3 w-3" /> Boleto</span>;
      case 'PIX':
        return <span className="text-sm flex items-center text-muted-foreground"><CreditCard className="mr-1 h-3 w-3" /> PIX</span>;
      case 'CARTAO_CREDITO':
        return <span className="text-sm flex items-center text-muted-foreground"><CreditCard className="mr-1 h-3 w-3" /> Cartão de Crédito</span>;
      case 'TRANSFERENCIA_BANCARIA':
        return <span className="text-sm flex items-center text-muted-foreground"><CreditCard className="mr-1 h-3 w-3" /> Transferência Bancária</span>;
      case 'DINHEIRO':
        return <span className="text-sm flex items-center text-muted-foreground"><CreditCard className="mr-1 h-3 w-3" /> Dinheiro</span>;
      default:
        return <span className="text-sm flex items-center text-muted-foreground"><CreditCard className="mr-1 h-3 w-3" /> {type}</span>;
    }
  };

  const toggleStatus = async (id: number, currentStatus: Invoice['status']) => {
    try {
      const newStatus = currentStatus === "PENDENTE" ? "PAGO" : "PENDENTE";
      
      const invoiceToUpdate = invoices.find(invoice => invoice.id === id);
      
      if (!invoiceToUpdate) return;
      
      await api.put(`/notas/${id}`, {
        ...invoiceToUpdate,
        status: newStatus
      });
      
      await refreshStats();
      
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === id ? { ...invoice, status: newStatus } : invoice
        )
      );
      
    } catch (err) {
      console.error("Error updating invoice status:", err);
      setError("Falha ao atualizar status. Por favor, tente novamente.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-[#1a365d] text-white p-6 rounded-t-lg mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Gerenciamento de Notas Fiscais</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-red-700 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-md mb-6">
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Tabs 
              defaultValue="TODOS" 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as "TODOS" | "PENDENTE" | "PAGO")}
              className="w-full sm:w-auto"
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="TODOS" className="cursor-pointer">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="PENDENTE" className="cursor-pointer">
                  <Clock className="mr-1 h-4 w-4" /> Pendentes
                </TabsTrigger>
                <TabsTrigger value="PAGO" className="cursor-pointer">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Pagas
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto sm:max-w-md md:max-w-lg relative">
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d]"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-gray-500 hover:text-[#1a365d]"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Link href="/notas-fiscais/emitir" className="w-full sm:w-auto">
              <Button className="bg-[#1a365d] text-white hover:bg-[#0f172a] cursor-pointer transition-colors w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Cadastrar Nova Nota Fiscal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[#1a365d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">Carregando notas fiscais...</p>
        </div>
      ) : currentInvoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentInvoices.map((invoice) => (
            <Card key={invoice.id} className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-medium text-[#1a365d]">
                  <div className="line-clamp-2 mr-2">{invoice.descricao}</div>
                </CardTitle>
                <div className="mt-2 flex justify-between items-center">
                  {getStatusBadge(invoice.status)}
                  <span className="text-sm text-muted-foreground">
                    {getCompanyName(invoice.empresaId)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pb-2 pt-4">
                <div className="space-y-3">
                  <Button 
                    variant={invoice.status === "PENDENTE" ? "default" : "outline"} 
                    size="sm" 
                    className={`w-full cursor-pointer mb-2 transition-colors ${
                      invoice.status === "PENDENTE" 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "hover:bg-yellow-100"
                    }`}
                    onClick={() => toggleStatus(invoice.id, invoice.status)}
                  >
                    {invoice.status === "PENDENTE" 
                      ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Marcar como Pago</> 
                      : <><Clock className="h-4 w-4 mr-2" /> Marcar como Pendente</>}
                  </Button>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor:</span>
                    <span className="font-medium">{formatCurrency(invoice.valor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Emissão:</span>
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 h-3 w-3" /> {formatDate(invoice.dataEmissao)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Vencimento:</span>
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 h-3 w-3" /> {formatDate(invoice.dataVencimento)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pagamento:</span>
                    {getPaymentType(invoice.tipoPagamento)}
                  </div>
                  {invoice.numeroBoleto && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Boleto:</span>
                      <span className="text-xs truncate max-w-[140px]">{invoice.numeroBoleto}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-4 flex justify-center gap-2 border-t">
                <Link href={`/notas-fiscais/editar/${invoice.id}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 text-[#1a365d] hover:bg-[#1a365d] hover:text-white transition-colors cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(invoice.id)}
                  className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <FileText className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg text-gray-500 mb-4">Nenhuma nota fiscal encontrada</p>
            <Link href="/notas-fiscais/emitir">
              <Button 
                className="bg-[#1a365d] text-white hover:bg-[#0f172a] cursor-pointer transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Cadastrar Nova Nota Fiscal
              </Button>
            </Link>
          </div>
        </div>
      )}

      {filteredInvoices.length > invoicesPerPage && (
        <div className="flex items-center justify-between py-6 mt-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Mostrando</span> {filteredInvoices.length > 0 ? startIndex + 1 : 0}-{endIndex} <span className="font-medium">de</span> {filteredInvoices.length} 
            {(searchQuery || statusFilter !== "TODOS") && ` (filtrado de ${invoices.length})`} notas fiscais
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="border-gray-300 text-gray-700 hover:bg-[#1a365d] hover:text-white disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`cursor-pointer w-8 h-8 p-0 ${
                    page === currentPage 
                      ? "bg-[#1a365d] text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="border-gray-300 text-gray-700 hover:bg-[#1a365d] hover:text-white disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta nota fiscal? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100 transition-colors cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
