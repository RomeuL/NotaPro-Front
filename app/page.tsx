import Link from "next/link"
import { Building2, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Selecione uma opção</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Gerenciamento de Empresas */}
          <Link href="/empresas" className="block transition-transform hover:scale-105">
            <Card className="hover:border-black h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Building2 className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-xl">Gerenciamento de Empresas</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center">
                  Cadastre, edite e gerencie informações das suas empresas. Mantenha todos os dados organizados em um só
                  lugar.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-6">
                <Button variant="outline">Acessar Gerenciamento</Button>
              </CardFooter>
            </Card>
          </Link>

          {/* Card 2: Gerenciamento de Notas Fiscais */}
          <Link href="/notas-fiscais" className="block transition-transform hover:scale-105">
            <Card className="hover:border-black h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <FileText className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-xl">Gerenciamento de Notas Fiscais</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center">
                  Emita, controle e acompanhe suas notas fiscais. Simplifique o processo de gestão fiscal da sua
                  empresa.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-6">
                <Button variant="outline">Acessar Notas Fiscais</Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

