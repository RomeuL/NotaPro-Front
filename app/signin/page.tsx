"use client";
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import LogoImage from '../../public/Fran-Check.png'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const signInSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type SignInFormValues = z.infer<typeof signInSchema>;

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>&"']/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
};

export default function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    setError(null);
    
    try {
      await login(data.email, data.senha);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setError(
        error.response?.data?.message || 
        'Falha na autenticação. Verifique suas credenciais.'
      );
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="mb-6">
        <Image
          src={LogoImage}
          alt="Fran-Check Logo"
          width={200}
          height={50}
          priority
          className="h-auto"
        />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com seu email e senha para acessar sua conta.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="flex justify-center">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        {...field} 
                        className="text-center" 
                        onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
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
                  <FormItem className="text-center">
                    <FormLabel className="flex justify-center">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="sua senha" 
                        {...field} 
                        className="text-center" 
                        onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="p-3 text-sm text-white bg-destructive rounded-md text-center">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="mt-4 flex justify-center">
              <Button 
                className="px-8 bg-green-600 hover:bg-green-700 text-white" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
