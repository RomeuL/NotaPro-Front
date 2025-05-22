"use client"

import Link from "next/link"
import { LogOut, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  
  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-auto">
                {/* Logo will go here */}
                <div className="w-32 h-8 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  LOGO
                </div>
              </div>
              <span className="font-semibold text-lg">NotaPro</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin/usuarios">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                Gerenciar Usuários
              </Button>
            </Link>
          )}
          <div className="font-medium mr-2">
            Bem-vindo, <span className="font-bold">{user?.nome || 'Usuário'}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white border-red-500 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}