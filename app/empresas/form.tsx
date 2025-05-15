"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Schema, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { formatCNPJ, formatPhone } from "@/utils";

// Zod schema
const schema = z.object({
  name: z.string().nonempty("Nome da empresa é obrigatório"),
  cnpj: z
    .string()
    .nonempty("CNPJ é obrigatório")
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ deve estar no formato 00.000.000/0000-00"
    ),
  address: z.string().nonempty("Endereço é obrigatório"),
  city: z.string().nonempty("Cidade é obrigatória"),
  state: z.string().nonempty("Estado é obrigatório"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{2}\) \d{5}-\d{4}$/.test(val), {
      message: "Telefone deve estar no formato (00) 90000-0000",
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Email inválido",
    }),
});

type FormData = z.infer<typeof schema>;

export default function FormEmpresaPage({
  empresa,
}: {
  empresa?: z.infer<typeof schema>;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: empresa,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/empresas");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cadastrar Nova Empresa</CardTitle>
              <CardDescription>
                Preencha os dados da empresa para cadastrá-la no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(errors).length > 0 && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>
                    Por favor, corrija os erros no formulário antes de
                    continuar.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Nome da Empresa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Digite o nome da empresa"
                  {...register("name")}
                  className={errors.name && "border-destructive"}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="flex items-center gap-1">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  {...register("cnpj", {
                    onChange: (e) =>
                      (e.target.value = formatCNPJ(e.target.value)),
                  })}
                  className={errors.cnpj && "border-destructive"}
                />
                {errors.cnpj && (
                  <p className="text-sm text-destructive">
                    {errors.cnpj.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1">
                  Endereço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Digite o endereço completo"
                  {...register("address")}
                  className={errors.address && "border-destructive"}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-1">
                    Cidade <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    {...register("city")}
                    className={errors.city && "border-destructive"}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center gap-1">
                    Estado <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="Estado"
                    {...register("state")}
                    className={errors.state && "border-destructive"}
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 90000-0000"
                  {...register("phone", {
                    onChange: (e) =>
                      (e.target.value = formatPhone(e.target.value)),
                  })}
                  className={errors.phone && "border-destructive"}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="contato@empresa.com"
                  {...register("email")}
                  className={errors.email && "border-destructive"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/empresas">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Empresa"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
