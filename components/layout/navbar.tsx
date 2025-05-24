"use client"

import Link from "next/link"
import Image from "next/image"
import { LogOut, UserPlus, Home, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  
  return (
    <div className="border-b shadow-sm bg-white">
      <div className="flex h-16 items-center justify-between w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-1">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <div className="flex items-center">
              <div className="h-8 w-auto">
                <Image
                  src="/Fran-Check.png"
                  alt="Logo NotaPro"
                  width={128}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center ml-6 space-x-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#1a365d] cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link href="/empresas">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#1a365d] cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out">
                <Building2 className="h-4 w-4 mr-2" />
                Empresas
              </Button>
            </Link>
            <Link href="/notas-fiscais">
              <Button variant="ghost" size="sm"  className="text-gray-700 hover:text-[#1a365d] cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out">
                <FileText className="h-4 w-4 mr-2" />
                Notas Fiscais
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4 justify-end">
          {isAdmin && (
            <Link href="/admin/usuarios">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 cursor-pointer border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white transition-all duration-200 ease-in-out"
              >
                <UserPlus className="h-4 w-4" />
                Gerenciar Usuários
              </Button>
            </Link>
          )}
          <div className="font-medium text-gray-700 hidden sm:block">
            Bem-vindo(a), <span className="font-bold text-[#1a365d]">{user?.nome || 'Usuário'}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  )
}