// app/actions/produtos.ts
'use server';

import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function adicionarProduto(formData: FormData) {
  const nome = formData.get('nome') as string;
  const descricao = formData.get('descricao') as string;
  const preco = parseFloat(formData.get('preco') as string);
  const categoriaId = formData.get('categoriaId') as string;
  const imageUrl = formData.get('imageUrl') as string; // Pegando a imagem do formulário

  const novoId = `prod-${Date.now()}`;

  await db.insert(products).values({
    id: novoId,
    name: nome,
    description: descricao,
    price: preco,
    categoryId: categoriaId,
    imageUrl: imageUrl || null, // Salvando no Turso
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function removerProduto(formData: FormData) {
  const id = formData.get('id') as string;

  await db.delete(products).where(eq(products.id, id));

  revalidatePath('/admin');
  revalidatePath('/');
}