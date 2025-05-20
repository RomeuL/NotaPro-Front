"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  senha: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  funcao: z.enum(["admin", "usuario"], {
    required_error: "Selecione uma função.",
  }),
});

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"success" | "error" | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      funcao: "usuario",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(values);
      setFormStatus("success");
    } catch (error) {
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center text-sm text-gray-500">
            Preencha os campos abaixo para criar sua conta
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu nome completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funcao"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="usuario" id="usuario" />
                          <Label htmlFor="usuario">Usuário</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin">Administrador</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Registrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {formStatus === "success" && (
            <div className="flex items-center text-green-600 gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Registro realizado com sucesso!</span>
            </div>
          )}
          {formStatus === "error" && (
            <div className="flex items-center text-red-600 gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Erro ao registrar. Tente novamente.</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
