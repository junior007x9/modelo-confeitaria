// app/page.tsx
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import StoreFront from '@/components/StoreFront';
import { getSettings } from '@/app/actions/config';

export default async function Home() {
  const settings = await getSettings();
  
  // Buscamos os produtos
  const produtosDoBanco = await db
    .select({
      id: products.id, name: products.name, description: products.description,
      price: products.price, category: categories.name, imageUrl: products.imageUrl,
    })
    .from(products).innerJoin(categories, eq(products.categoryId, categories.id));

  // Buscamos as categorias para o menu de filtro
  const categoriasDoBanco = await db.select().from(categories);

  return <StoreFront produtos={produtosDoBanco} settings={settings} categorias={categoriasDoBanco} />;
}