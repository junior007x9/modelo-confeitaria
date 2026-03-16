// app/actions/auth.ts
'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

// 1. Função de Cadastro
export async function realizarCadastro(formData: FormData) {
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const senha = formData.get('senha') as string;

  // Verifica se o email já existe
  const usuarioExistente = await db.select().from(users).where(eq(users.email, email));
  if (usuarioExistente.length > 0) {
    return { error: 'Este e-mail já está cadastrado.' };
  }

  // Criptografa a senha (nunca salvamos a senha real no banco!)
  const salt = await bcrypt.genSalt(10);
  const senhaCriptografada = await bcrypt.hash(senha, salt);
  const novoId = `usr-${Date.now()}`;

  await db.insert(users).values({
    id: novoId,
    name: nome,
    email: email,
    password: senhaCriptografada,
  });

  return { success: true };
}

// 2. Função de Login
export async function realizarLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const senha = formData.get('senha') as string;

  // Busca o usuário
  const usuario = await db.select().from(users).where(eq(users.email, email));
  if (usuario.length === 0) {
    return { error: 'E-mail ou senha incorretos.' };
  }

  // Verifica se a senha bate com a criptografada
  const senhaValida = await bcrypt.compare(senha, usuario[0].password);
  if (!senhaValida) {
    return { error: 'E-mail ou senha incorretos.' };
  }

  // Gera o "Crachá" (Token JWT) válido por 7 dias
  const token = await new SignJWT({ id: usuario[0].id, nome: usuario[0].name, email: usuario[0].email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  // Salva o crachá nos Cookies do navegador do usuário de forma segura
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  });

  return { success: true };
}

// 3. Função de Sair (Logout)
export async function realizarLogout() {
  cookies().delete('auth_token');
  return { success: true };
}