import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/signin', '/signup', '/', '/forgot-password'];

export function middleware(request: NextRequest) {
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  );
  
  // Se for uma rota pública, permite o acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Verifica se existe um token no localStorage (através de cookie)
  const token = request.cookies.get('auth-token')?.value;
  
  // Se não tiver token, redireciona para o login
  if (!token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // Se tiver token, permite o acesso
  return NextResponse.next();
}

// Configuração que define em quais rotas o middleware será executado
export const config = {
  matcher: [
    // Exclui arquivos estáticos e API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}