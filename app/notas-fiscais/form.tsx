"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

interface Invoice {
  id?: number;
  descricao: string;
  empresaId: number;
  dataEmissao: string;
  dataVencimento: string;
  valor: number;
  tipoPagamento: "BOLETO" | "PIX" | "CARTAO_CREDITO" | "TRANSFERENCIA_BANCARIA" | "DINHEIRO";
  numeroBoleto: string | null;
  status: "PENDENTE" | "PAGO";
}

interface Company {
  id: number;
  nome: string;
  cnpj: string;
}

interface FormErrors {
  descricao?: string;
  empresaId?: string;
  dataEmissao?: string;
  dataVencimento?: string;
  valor?: string;
  tipoPagamento?: string;
  numeroBoleto?: string;
  general?: string;
}

interface FormNotaFiscalProps {
  notaFiscal?: Invoice;
}

export default function FormNotaFiscalPage({ notaFiscal }: FormNotaFiscalProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<Invoice>({
    descricao: "",
    empresaId: 0,
    dataEmissao: new Date().toISOString().split("T")[0],
    dataVencimento: new Date().toISOString().split("T")[0],
    valor: 0,
    tipoPagamento: "BOLETO",
    numeroBoleto: null,
    status: "PENDENTE",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/empresas");
        setCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (notaFiscal) {
      setFormData(notaFiscal);
    }
  }, [notaFiscal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'valor') {
      const numbersOnly = value.replace(/[^\d,\.]/g, '');
      
      const normalizedValue = numbersOnly.replace(',', '.');
      
      const numericValue = parseFloat(normalizedValue) || 0;
      
      setFormData((prev) => ({ 
        ...prev, 
        [id]: numericValue
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = e.target.selectionStart;
    
    const unformattedValue = e.target.value.replace(/[^\d]/g, '');
    
    const cents = unformattedValue === '' ? 0 : parseInt(unformattedValue);
    
    const valueAsFloat = cents / 100;
    
    setFormData((prev) => ({ 
      ...prev, 
      valor: valueAsFloat
    }));
    
    if (errors.valor) {
      setErrors((prev) => ({ ...prev, valor: undefined }));
    }
  };

  const handleSelectChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
      isValid = false;
    }

    if (!formData.empresaId) {
      newErrors.empresaId = "Empresa é obrigatória";
      isValid = false;
    }

    if (!formData.dataEmissao) {
      newErrors.dataEmissao = "Data de emissão é obrigatória";
      isValid = false;
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = "Data de vencimento é obrigatória";
      isValid = false;
    }

    if (!formData.valor) {
      newErrors.valor = "Valor é obrigatório";
      isValid = false;
    }

    if (!formData.tipoPagamento) {
      newErrors.tipoPagamento = "Tipo de pagamento é obrigatório";
      isValid = false;
    }

    if (formData.tipoPagamento === "BOLETO" && !formData.numeroBoleto) {
      newErrors.numeroBoleto = "Número do boleto é obrigatório para este tipo de pagamento";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        general: "Por favor, corrija os erros no formulário antes de continuar.",
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      if (notaFiscal?.id) {
        await api.put(`/notas/${notaFiscal.id}`, formData);
      } else {
        await api.post("/notas", formData);
      }
      router.push("/notas-fiscais");
    } catch (err) {
      console.error("Error saving invoice:", err);
      setErrors((prev) => ({
        ...prev,
        general: "Ocorreu um erro ao salvar a nota fiscal. Por favor, tente novamente.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = notaFiscal ? "Editar Nota Fiscal" : "Cadastrar Nova Nota Fiscal";
  const pageDescription = notaFiscal
    ? "Atualize os dados da nota fiscal."
    : "Preencha os dados para cadastrar uma nova nota fiscal.";
  const submitButtonText = notaFiscal
    ? isSubmitting ? "Salvando..." : "Salvar Alterações"
    : isSubmitting ? "Cadastrando..." : "Cadastrar Nota Fiscal";

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
      style: 'decimal'
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{pageTitle}</CardTitle>
              <CardDescription>{pageDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.general && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="descricao" className="flex items-center gap-1">
                  Descrição <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="descricao"
                  placeholder="Descrição da nota fiscal"
                  value={formData.descricao}
                  onChange={handleChange}
                  className={errors.descricao ? "border-destructive" : ""}
                />
                {errors.descricao && (
                  <p className="text-sm text-destructive">{errors.descricao}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresaId" className="flex items-center gap-1">
                  Empresa <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.empresaId.toString()}
                  onValueChange={(value) => handleSelectChange("empresaId", parseInt(value))}
                >
                  <SelectTrigger className={errors.empresaId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.empresaId && (
                  <p className="text-sm text-destructive">{errors.empresaId}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataEmissao" className="flex items-center gap-1">
                    Data de Emissão <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={handleChange}
                    className={errors.dataEmissao ? "border-destructive" : ""}
                  />
                  {errors.dataEmissao && (
                    <p className="text-sm text-destructive">{errors.dataEmissao}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVencimento" className="flex items-center gap-1">
                    Data de Vencimento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dataVencimento"
                    type="date"
                    value={formData.dataVencimento}
                    onChange={handleChange}
                    className={errors.dataVencimento ? "border-destructive" : ""}
                  />
                  {errors.dataVencimento && (
                    <p className="text-sm text-destructive">{errors.dataVencimento}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor" className="flex items-center gap-1">
                  Valor (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={formatCurrency(formData.valor)}
                  onChange={handleCurrencyInput}
                  className={errors.valor ? "border-destructive" : ""}
                />
                {errors.valor && (
                  <p className="text-sm text-destructive">{errors.valor}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoPagamento" className="flex items-center gap-1">
                  Tipo de Pagamento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tipoPagamento}
                  onValueChange={(value) => handleSelectChange("tipoPagamento", value)}
                >
                  <SelectTrigger className={errors.tipoPagamento ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o tipo de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                    <SelectItem value="TRANSFERENCIA_BANCARIA">Transferência Bancária</SelectItem>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoPagamento && (
                  <p className="text-sm text-destructive">{errors.tipoPagamento}</p>
                )}
              </div>

              {formData.tipoPagamento === "BOLETO" && (
                <div className="space-y-2">
                  <Label htmlFor="numeroBoleto" className="flex items-center gap-1">
                    Número do Boleto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numeroBoleto"
                    placeholder="Digite o número do boleto"
                    value={formData.numeroBoleto || ""}
                    onChange={handleChange}
                    className={errors.numeroBoleto ? "border-destructive" : ""}
                  />
                  {errors.numeroBoleto && (
                    <p className="text-sm text-destructive">{errors.numeroBoleto}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-1">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="PAGO">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/notas-fiscais">
                <Button variant="outline" type="button" className="cursor-pointer">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {submitButtonText}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
