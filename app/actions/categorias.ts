// app/actions/categorias.ts
'use server';

import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function adicionarCategoria(formData: FormData) {
  const nome = formData.get('nome') as string;
  const novoId = `cat-${Date.now()}`;

  await db.insert(categories).values({
    id: novoId,
    name: nome,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/categorias');
  revalidatePath('/');
}

export async function removerCategoria(formData: FormData) {
  const id = formData.get('id') as string;

  // Primeiro apagamos os produtos que pertencem a essa categoria para não dar erro no banco
  await db.delete(products).where(eq(products.categoryId, id));
  
  // Depois apagamos a categoria
  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath('/admin');
  revalidatePath('/admin/categorias');
  revalidatePath('/');
}