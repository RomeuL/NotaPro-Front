
import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Gerenciamento",
  description: "Sistema para gerenciamento de empresas e notas fiscais",
};

export default function RootLayout({
  children,
}: {

  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
