// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Qual é a nossa chave secreta?
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  // Pega o crachá (cookie) do usuário
  const token = request.cookies.get('auth_token')?.value;
  
  const indoParaAdmin = request.nextUrl.pathname.startsWith('/admin');
  const indoParaLogin = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/cadastro');

  // REGRA 1: Quer entrar no Admin mas NÃO tem token? Vai pro Login!
  if (indoParaAdmin && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // REGRA 2: Tem token? Vamos validar se é verdadeiro.
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      
      // Se ele já está logado e tentar acessar a tela de Login, mandamos direto pro Admin
      if (indoParaLogin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      // Se o token for falso ou expirado, deletamos e mandamos pro Login
      request.cookies.delete('auth_token');
      if (indoParaAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Em quais rotas o nosso "Segurança" deve ficar de olho?
export const config = {
  matcher: ['/admin/:path*', '/login', '/cadastro'],
};