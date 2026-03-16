// db/seed.ts
import { db } from './index';
import { categories, products } from './schema';

async function main() {
  console.log('⏳ Inserindo dados iniciais no Turso...');

  const catBolosId = 'cat-bolos';
  const catSalgadosId = 'cat-salgados';
  const catDocesId = 'cat-doces';

  // Limpa as tabelas antes de inserir para não duplicar se você rodar 2 vezes
  await db.delete(products);
  await db.delete(categories);

  // 1. Criar categorias
  await db.insert(categories).values([
    { id: catBolosId, name: 'Bolos' },
    { id: catSalgadosId, name: 'Salgados' },
    { id: catDocesId, name: 'Doces' },
  ]);

  // 2. Criar produtos
  await db.insert(products).values([
    { id: 'prod-1', name: 'Bolo Vulcão de Chocolate', description: 'Massa fofinha com cobertura generosa de brigadeiro que derrete na boca.', price: 45.90, categoryId: catBolosId },
    { id: 'prod-2', name: 'Bolo Red Velvet', description: 'Tradicional massa vermelha com recheio de cream cheese original.', price: 65.00, categoryId: catBolosId },
    { id: 'prod-3', name: 'Cento de Coxinha', description: 'Massa de batata recheada com frango temperado e desfiado.', price: 75.00, categoryId: catSalgadosId },
    { id: 'prod-4', name: 'Empada de Frango', description: 'Massa podre derretendo na boca com frango cremoso e azeitona.', price: 6.50, categoryId: catSalgadosId },
    { id: 'prod-5', name: 'Brigadeiro Gourmet', description: 'Feito com chocolate belga 54% (unidade).', price: 4.50, categoryId: catDocesId },
    { id: 'prod-6', name: 'Mini Donuts', description: 'Caixa com 4 unidades sortidas com coberturas variadas.', price: 12.00, categoryId: catDocesId },
  ]);

  console.log('✅ Dados inseridos com sucesso!');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Erro ao inserir dados:', e);
  process.exit(1);
});