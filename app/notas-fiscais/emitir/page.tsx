"use client";

import type React from "react";

import { useState } from "react";
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
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    number: "",
    company: "",
    date: new Date().toISOString().split("T")[0],
    value: "",
    status: "Pendente",
    items: [{ description: "", quantity: "", unitPrice: "" }],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when field is edited
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is edited
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    setFormData((prev) => ({ ...prev, items: newItems }));

    // Clear error when field is edited
    if (
      errors.items &&
      errors.items[index] &&
      errors.items[index][field as keyof (typeof errors.items)[index]]
    ) {
      const newErrors = { ...errors };
      if (newErrors.items && newErrors.items[index]) {
        newErrors.items[index] = {
          ...newErrors.items[index],
          [field]: undefined,
        };
      }
      setErrors(newErrors);
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "", unitPrice: "" }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData((prev) => ({ ...prev, items: newItems }));

      // Remove errors for this item
      if (errors.items) {
        const newErrors = { ...errors };
        if (newErrors.items) {
          newErrors.items.splice(index, 1);
          setErrors(newErrors);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate invoice number
    if (!formData.number.trim()) {
      newErrors.number = "Número da nota fiscal é obrigatório";
      isValid = false;
    }

    // Validate company
    if (!formData.company) {
      newErrors.company = "Empresa é obrigatória";
      isValid = false;
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = "Data é obrigatória";
      isValid = false;
    }

    // Validate value
    if (!formData.value.trim()) {
      newErrors.value = "Valor é obrigatório";
      isValid = false;
    } else if (!/^\d+(,\d{1,2})?$/.test(formData.value.trim())) {
      newErrors.value = "Valor deve ser um número válido (ex: 1234,56)";
      isValid = false;
    }

    // Validate items
    const itemErrors: Array<{
      description?: string;
      quantity?: string;
      unitPrice?: string;
    }> = [];

    let hasItemErrors = false;

    formData.items.forEach((item, index) => {
      const itemError: {
        description?: string;
        quantity?: string;
        unitPrice?: string;
      } = {};

      if (!item.description.trim()) {
        itemError.description = "Descrição é obrigatória";
        hasItemErrors = true;
      }

      if (!item.quantity.trim()) {
        itemError.quantity = "Quantidade é obrigatória";
        hasItemErrors = true;
      } else if (!/^\d+$/.test(item.quantity.trim())) {
        itemError.quantity = "Quantidade deve ser um número inteiro";
        hasItemErrors = true;
      }

      if (!item.unitPrice.trim()) {
        itemError.unitPrice = "Preço unitário é obrigatório";
        hasItemErrors = true;
      } else if (!/^\d+(,\d{1,2})?$/.test(item.unitPrice.trim())) {
        itemError.unitPrice = "Preço deve ser um número válido (ex: 123,45)";
        hasItemErrors = true;
      }

      itemErrors[index] = itemError;
    });

    if (hasItemErrors) {
      newErrors.items = itemErrors;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        // In a real app, you would save the data to your backend here
        router.push("/notas-fiscais");
      }, 1000);
    } else {
      setErrors((prev) => ({
        ...prev,
        general:
          "Por favor, corrija os erros no formulário antes de continuar.",
      }));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Emitir Nova Nota Fiscal
              </CardTitle>
              <CardDescription>
                Preencha os dados para emitir uma nova nota fiscal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.general && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.general}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number" className="flex items-center gap-1">
                    Número <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="number"
                    placeholder="NF-e 000001"
                    value={formData.number}
                    onChange={handleChange}
                    className={errors.number ? "border-destructive" : ""}
                  />
                  {errors.number && (
                    <p className="text-sm text-destructive">{errors.number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-1">
                    Empresa <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.company}
                    onValueChange={(value) =>
                      handleSelectChange("company", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.company ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.name}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.company && (
                    <p className="text-sm text-destructive">{errors.company}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-1">
                    Data <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? "border-destructive" : ""}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value" className="flex items-center gap-1">
                    Valor Total (R$) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="value"
                    placeholder="0,00"
                    value={formData.value}
                    onChange={handleChange}
                    className={errors.value ? "border-destructive" : ""}
                  />
                  {errors.value && (
                    <p className="text-sm text-destructive">{errors.value}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Emitida">Emitida</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg">Itens da Nota Fiscal</Label>
                  <Button type="button" variant="outline" onClick={addItem}>
                    Adicionar Item
                  </Button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remover
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`item-${index}-description`}
                        className="flex items-center gap-1"
                      >
                        Descrição <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`item-${index}-description`}
                        placeholder="Descrição do item"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className={
                          errors.items && errors.items[index]?.description
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.items && errors.items[index]?.description && (
                        <p className="text-sm text-destructive">
                          {errors.items[index].description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`item-${index}-quantity`}
                          className="flex items-center gap-1"
                        >
                          Quantidade <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`item-${index}-quantity`}
                          placeholder="0"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className={
                            errors.items && errors.items[index]?.quantity
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.items && errors.items[index]?.quantity && (
                          <p className="text-sm text-destructive">
                            {errors.items[index].quantity}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`item-${index}-unitPrice`}
                          className="flex items-center gap-1"
                        >
                          Preço Unitário (R$){" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`item-${index}-unitPrice`}
                          placeholder="0,00"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(index, "unitPrice", e.target.value)
                          }
                          className={
                            errors.items && errors.items[index]?.unitPrice
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.items && errors.items[index]?.unitPrice && (
                          <p className="text-sm text-destructive">
                            {errors.items[index].unitPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/notas-fiscais">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Emitindo..." : "Emitir Nota Fiscal"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
