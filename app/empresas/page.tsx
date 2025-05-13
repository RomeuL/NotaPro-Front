import Link from "next/link"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for companies
const companies = [
  { id: 1, name: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90", address: "Av. Paulista, 1000, São Paulo - SP" },
  { id: 2, name: "Comércio XYZ S.A.", cnpj: "98.765.432/0001-10", address: "Rua Augusta, 500, São Paulo - SP" },
  { id: 3, name: "Indústria 123 Ltda", cnpj: "45.678.901/0001-23", address: "Av. Brasil, 2000, Rio de Janeiro - RJ" },
  {
    id: 4,
    name: "Serviços Tech Ltda",
    cnpj: "34.567.890/0001-45",
    address: "Rua da Informação, 404, Belo Horizonte - MG",
  },
]

export default function EmpresasPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
        <Link href="/empresas/cadastrar">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Nova Empresa
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.cnpj}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/empresas/editar/${company.id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}