"use client"

import Link from "next/link"
import { Building2, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
      <div className="w-full bg-[#1a365d] text-white py-10 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">
            Bem-Vindo(a) ao NotaPro
          </h1>
          <p className="text-lg opacity-90">
            Sistema de Gerenciamento de Notas Fiscais e Empresas
          </p>
        </div>
      </div>

      <div className="max-w-4xl w-full px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/empresas" className="block group">
            <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden">
              <div className="h-3 bg-[#1a365d] w-full group-hover:h-5 transition-all"></div>
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">
                  <Building2 className="h-16 w-16 text-[#1a365d] group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-2xl text-[#1a365d]">
                  Gerenciamento de Empresas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center text-gray-600 text-base">
                  Cadastre, edite e gerencie informações das suas empresas parceiras.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-8">
                <Button 
                  className="bg-[#1a365d] text-white hover:bg-[#0f172a] cursor-pointer transition-colors"
                >
                  Acessar Gerenciamento
                </Button>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/notas-fiscais" className="block group">
            <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden">
              <div className="h-3 bg-[#1a365d] w-full group-hover:h-5 transition-all"></div>
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">
                  <FileText className="h-16 w-16 text-[#1a365d] group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-2xl text-[#1a365d]">
                  Gerenciamento de Notas Fiscais
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center text-gray-600 text-base">
                  Cadastre, controle e acompanhe suas notas fiscais.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-8">
                <Button 
                  className="bg-[#1a365d] text-white hover:bg-[#0f172a] cursor-pointer transition-colors"
                >
                  Acessar Notas Fiscais
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
