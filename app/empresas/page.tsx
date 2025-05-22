"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formatCNPJ } from "@/utils";
import api from "@/lib/api";

interface Company {
  id: number;
  nome: string;
  cnpj: string;
}

const companySchema = z.object({
  nome: z.string().nonempty("Nome da empresa é obrigatório"),
  cnpj: z
    .string()
    .nonempty("CNPJ é obrigatório")
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ deve estar no formato 00.000.000/0000-00"
    ),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");

  const createForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nome: "",
      cnpj: "",
    },
  });

  const editForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/empresas");
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Falha ao carregar empresas. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        setIsLoading(true);
        await api.delete(`/empresas/${deleteId}`);
        setCompanies(companies.filter((company) => company.id !== deleteId));
        setError(null);
      } catch (err) {
        console.error("Error deleting company:", err);
        setError("Falha ao excluir empresa. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const stripCNPJFormatting = (cnpj: string): string => {
    return cnpj.replace(/[^\d]/g, "");
  };

  const handleCreateSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);
      const apiData = {
        ...data,
        cnpj: stripCNPJFormatting(data.cnpj),
      };
      const response = await api.post("/empresas", apiData);
      setCompanies([...companies, response.data]);
      setIsCreateModalOpen(false);
      createForm.reset();
      setError(null);
    } catch (err) {
      console.error("Error creating company:", err);
      setError("Falha ao cadastrar empresa. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    editForm.reset({
      nome: company.nome,
      cnpj: company.cnpj,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: CompanyFormValues) => {
    if (!selectedCompany) return;

    try {
      setIsSubmitting(true);
      const apiData = {
        ...data,
        cnpj: stripCNPJFormatting(data.cnpj),
      };
      const response = await api.put(`/empresas/${selectedCompany.id}`, apiData);

      setCompanies(
        companies.map((company) =>
          company.id === selectedCompany.id ? response.data : company
        )
      );

      setIsEditModalOpen(false);
      setSelectedCompany(null);
      setError(null);
    } catch (err) {
      console.error("Error updating company:", err);
      setError("Falha ao atualizar empresa. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCompanies.length);
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

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
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Nova Empresa
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 p-3 rounded-md text-destructive mb-6">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 max-w-sm">
          <Input
            placeholder="Buscar empresa por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="bg-gray-200">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">CNPJ</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Carregando empresas...
                </TableCell>
              </TableRow>
            ) : companies.length > 0 ? (
              currentCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.nome}</TableCell>
                  <TableCell>{formatCNPJ(company.cnpj)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(company)}
                        className="cursor-pointer hover:bg-gray-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(company.id)}
                        className="cursor-pointer bg-red-400 hover:bg-red-500 text-white border-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhuma empresa cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
            <DialogDescription>
              Preencha os dados da empresa para cadastrá-la no sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-1">
                  Nome da Empresa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome da empresa"
                  {...createForm.register("nome")}
                  className={
                    createForm.formState.errors.nome && "border-destructive"
                  }
                />
                {createForm.formState.errors.nome && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="flex items-center gap-1">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  {...createForm.register("cnpj", {
                    onChange: (e) => (e.target.value = formatCNPJ(e.target.value)),
                  })}
                  className={
                    createForm.formState.errors.cnpj && "border-destructive"
                  }
                />
                {createForm.formState.errors.cnpj && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.cnpj.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? "Salvando..." : "Salvar Empresa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize os dados da empresa no sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome" className="flex items-center gap-1">
                  Nome da Empresa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-nome"
                  placeholder="Digite o nome da empresa"
                  {...editForm.register("nome")}
                  className={
                    editForm.formState.errors.nome && "border-destructive"
                  }
                />
                {editForm.formState.errors.nome && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cnpj" className="flex items-center gap-1">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-cnpj"
                  placeholder="00.000.000/0000-00"
                  {...editForm.register("cnpj", {
                    onChange: (e) => (e.target.value = formatCNPJ(e.target.value)),
                  })}
                  className={
                    editForm.formState.errors.cnpj && "border-destructive"
                  }
                />
                {editForm.formState.errors.cnpj && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.cnpj.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? "Salvando..." : "Atualizar Empresa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {companies.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredCompanies.length > 0 ? startIndex + 1 : 0}-{endIndex} de {filteredCompanies.length} 
            {searchQuery && ` (filtrado de ${companies.length})`} empresas
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="cursor-pointer"
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
                    page === currentPage ? "bg-primary text-primary-foreground" : ""
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
              className="cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
