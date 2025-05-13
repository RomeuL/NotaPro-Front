import Link from "next/link"
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for invoices
const invoices = [
  {
    id: 1,
    number: "NF-e 000001",
    company: "Empresa ABC Ltda",
    date: "15/04/2023",
    value: "R$ 1.250,00",
    status: "Emitida",
  },
  {
    id: 2,
    number: "NF-e 000002",
    company: "Comércio XYZ S.A.",
    date: "22/04/2023",
    value: "R$ 3.780,50",
    status: "Cancelada",
  },
  {
    id: 3,
    number: "NF-e 000003",
    company: "Indústria 123 Ltda",
    date: "30/04/2023",
    value: "R$ 5.430,75",
    status: "Emitida",
  },
  {
    id: 4,
    number: "NF-e 000004",
    company: "Serviços Tech Ltda",
    date: "05/05/2023",
    value: "R$ 2.100,00",
    status: "Pendente",
  },
]

export default function NotasFiscaisPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Notas Fiscais</h1>
        <Link href="/notas-fiscais/emitir">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Emitir Nova Nota Fiscal
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.company}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.value}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "Emitida"
                        ? "default"
                        : invoice.status === "Cancelada"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/notas-fiscais/visualizar/${invoice.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {invoice.status !== "Cancelada" && (
                      <>
                        <Link href={`/notas-fiscais/editar/${invoice.id}`}>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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