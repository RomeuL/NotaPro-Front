"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string | null;
  role: string;
}

const userSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  senha: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres." })
    .optional(),
  role: z.enum(["ADMIN", "USER"], {
    required_error: "Selecione uma função.",
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");

  const createForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      role: "USER",
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(
      userSchema.extend({
        senha: z
          .string()
          .refine(
            (value) => value === "" || value.length >= 6,
            {
              message: "Senha deve ter pelo menos 6 caracteres.",
            }
          )
          .optional(),
      })
    ),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Falha ao carregar usuários. Por favor, tente novamente.");
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
        await api.delete(`/users/${deleteId}`);
        setUsers(users.filter((user) => user.id !== deleteId));
        setError(null);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Falha ao excluir usuário. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleCreateSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/register", data);
      setUsers([...users, response.data]);
      setIsCreateModalOpen(false);
      createForm.reset();
      setError(null);
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Falha ao cadastrar usuário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      nome: user.nome,
      email: user.email,
      role: user.role as "ADMIN" | "USER",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: UserFormValues) => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);

      const apiData = { ...data };
      if (!apiData.senha) {
        delete apiData.senha;
      }

      const response = await api.put(`/users/${selectedUser.id}`, apiData);

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );

      setIsEditModalOpen(false);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Falha ao atualizar usuário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
      <div className="bg-[#1a365d] text-white p-6 rounded-t-lg mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-red-700 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-md">
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 max-w-sm">
            <Input
              placeholder="Buscar usuário por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d]"
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
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#1a365d] text-white hover:bg-[#0f172a] cursor-pointer transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Cadastrar Novo Usuário
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-[#1a365d] text-white">
            <TableRow>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Função</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 bg-gray-50">
                  <div className="flex justify-center">
                    <svg
                      className="animate-spin h-6 w-6 text-[#1a365d]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Carregando usuários...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-blue-50"
                  }
                >
                  <TableCell className="font-medium text-[#1a365d]">
                    {user.nome}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN" ? "default" : "secondary"
                      }
                      className={user.role === "ADMIN" ? "bg-blue-600" : ""}
                    >
                      {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(user)}
                        className="border-gray-300 text-[#1a365d] hover:bg-[#1a365d] hover:text-white transition-colors cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
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
                  colSpan={4}
                  className="text-center py-10 text-gray-500 bg-gray-50"
                >
                  <div className="flex flex-col items-center">
                    <Users className="h-10 w-10 mb-2 text-gray-400" />
                    <p>Nenhum usuário encontrado</p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      variant="link"
                      className="mt-2 text-[#1a365d]"
                    >
                      Cadastrar seu primeiro usuário
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="flex items-center justify-between py-6 mt-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Mostrando</span>{" "}
            {filteredUsers.length > 0 ? startIndex + 1 : 0}-{endIndex}{" "}
            <span className="font-medium">de</span> {filteredUsers.length}
            {searchQuery && ` (filtrado de ${users.length})`} usuários
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100 transition-colors cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-xl text-[#1a365d]">
              Cadastrar Novo Usuário
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do usuário para cadastrá-lo no sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-1">
                  Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome do usuário"
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
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  {...createForm.register("email")}
                  className={
                    createForm.formState.errors.email && "border-destructive"
                  }
                />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="flex items-center gap-1">
                  Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="******"
                  {...createForm.register("senha")}
                  className={
                    createForm.formState.errors.senha && "border-destructive"
                  }
                />
                {createForm.formState.errors.senha && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.senha.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-1">
                  Função <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    createForm.setValue("role", value as "ADMIN" | "USER")
                  }
                  defaultValue={createForm.getValues("role")}
                >
                  <SelectTrigger
                    className={
                      createForm.formState.errors.role && "border-destructive"
                    }
                  >
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {createForm.formState.errors.role && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.role.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1a365d] hover:bg-[#0f172a] text-white cursor-pointer transition-colors"
              >
                {isSubmitting ? "Salvando..." : "Salvar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-xl text-[#1a365d]">
              Editar Usuário
            </DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome" className="flex items-center gap-1">
                  Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-nome"
                  placeholder="Digite o nome do usuário"
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
                <Label htmlFor="edit-email" className="flex items-center gap-1">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  {...editForm.register("email")}
                  className={
                    editForm.formState.errors.email && "border-destructive"
                  }
                />
                {editForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-senha" className="flex items-center gap-1">
                  Senha{" "}
                  <span className="text-muted-foreground text-xs">
                    (Deixe em branco para manter a mesma)
                  </span>
                </Label>
                <Input
                  id="edit-senha"
                  type="password"
                  placeholder="******"
                  {...editForm.register("senha")}
                  className={
                    editForm.formState.errors.senha && "border-destructive"
                  }
                />
                {editForm.formState.errors.senha && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.senha.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className="flex items-center gap-1">
                  Função <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    editForm.setValue("role", value as "ADMIN" | "USER")
                  }
                  defaultValue={editForm.getValues("role")}
                >
                  <SelectTrigger
                    className={
                      editForm.formState.errors.role && "border-destructive"
                    }
                  >
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {editForm.formState.errors.role && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.role.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1a365d] text-white hover:bg-[#0f172a] cursor-pointer transition-colors"
              >
                {isSubmitting ? "Salvando..." : "Atualizar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
