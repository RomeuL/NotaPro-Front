"use client";
import FormNotaFiscalPage from "../form";

interface FormData {
  number: string;
  company: string;
  date: string;
  value: string;
  status: string;
  items: Array<{
    description: string;
    quantity: string;
    unitPrice: string;
  }>;
}

interface FormErrors {
  number?: string;
  company?: string;
  date?: string;
  value?: string;
  status?: string;
  items?: Array<{
    description?: string;
    quantity?: string;
    unitPrice?: string;
  }>;
  general?: string;
}

// Mock companies for select
const companies = [
  { id: 1, name: "Empresa ABC Ltda" },
  { id: 2, name: "Comércio XYZ S.A." },
  { id: 3, name: "Indústria 123 Ltda" },
  { id: 4, name: "Serviços Tech Ltda" },
];

export default function EmitirNotaFiscalPage() {
  return <FormNotaFiscalPage />;
}
