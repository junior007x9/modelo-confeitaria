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

  const usuarioExistente = await db.select().from(users).where(eq(users.email, email));

  if (usuarioExistente.length > 0) {
    return { error: 'Este e-mail já está cadastrado.' };
  }

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

  const usuario = await db.select().from(users).where(eq(users.email, email));

  if (usuario.length === 0) {
    return { error: 'E-mail ou senha incorretos.' };
  }

  const senhaValida = await bcrypt.compare(senha, usuario[0].password);

  if (!senhaValida) {
    return { error: 'E-mail ou senha incorretos.' };
  }

  const token = await new SignJWT({
    id: usuario[0].id,
    nome: usuario[0].name,
    email: usuario[0].email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  // Correção para Next.js 16
  const cookieStore = await cookies();

  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true };
}

// 3. Função de Logout
export async function realizarLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');

  return { success: true };
}