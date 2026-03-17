// app/admin/page.tsx
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { adicionarProduto, removerProduto } from '@/app/actions/produtos';
import { eq } from 'drizzle-orm';
import { Trash2, Plus, Store, LayoutGrid, LogOut, Tags, Receipt, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

export default async function AdminPage() {
  const produtosDoBanco = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      category: categories.name,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

  const categoriasDoBanco = await db.select().from(categories);

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      
      {/* Cabeçalho Premium com Menu Completo */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:px-12 shadow-lg flex flex-col md:flex-row gap-4 justify-between md:items-center sticky top-0 z-40">
        <h1 className="text-2xl font-black flex items-center gap-3 shrink-0">
          <div className="bg-white/10 p-2 rounded-xl">
            <Store size={28} />
          </div>
          Gestão da Loja
        </h1>
        
        {/* Menu de Navegação Horizontal */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-2 w-full md:w-auto">
          
          <Link
            href="/admin/pedidos"
            className="whitespace-nowrap bg-white/10 text-white hover:bg-white/20 font-bold px-4 py-2.5 rounded-full text-sm transition-all flex items-center gap-2"
          >
            <Receipt size={16} /> Pedidos
          </Link>

          <Link
            href="/admin/categorias"
            className="whitespace-nowrap bg-white/10 text-white hover:bg-white/20 font-bold px-4 py-2.5 rounded-full text-sm transition-all flex items-center gap-2"
          >
            <Tags size={16} /> Categorias
          </Link>

          <Link
            href="/admin/configuracoes"
            className="whitespace-nowrap bg-white/10 text-white hover:bg-white/20 font-bold px-4 py-2.5 rounded-full text-sm transition-all flex items-center gap-2"
          >
            <Settings size={16} /> Visual
          </Link>

          <Link
            href="/admin/fiscal"
            className="whitespace-nowrap bg-white/10 text-green-300 hover:bg-white/20 font-bold px-4 py-2.5 rounded-full text-sm transition-all flex items-center gap-2 border border-green-400/30"
          >
            <ShieldCheck size={16} /> Fiscal
          </Link>

          {/* Divisor Visual */}
          <div className="w-px h-6 bg-white/20 mx-1 hidden md:block"></div>

          <Link
            href="/"
            className="whitespace-nowrap bg-white text-slate-900 hover:bg-primary hover:text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-md flex items-center gap-2"
          >
            <LayoutGrid size={16} /> Ver Loja
          </Link>
          
          <form
            action={async () => {
              'use server';
              const { realizarLogout } = await import('@/app/actions/auth');
              await realizarLogout();
              const { redirect } = await import('next/navigation');
              redirect('/login');
            }}
          >
            <button
              type="submit"
              className="bg-primary hover:bg-primary/80 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-md flex items-center gap-2 border border-primary/20"
            >
              <LogOut size={16} /> Sair
            </button>
          </form>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <section className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:sticky lg:top-32 h-fit">
          <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-slate-800 border-b border-gray-100 pb-4">
            <div className="bg-primary/10 text-primary p-2 rounded-xl">
              <Plus size={24} />
            </div> 
            Novo Produto
          </h2>
          
          <form action={adicionarProduto} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nome do Produto
              </label>
              <input
                type="text"
                name="nome"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                placeholder="Ex: Bolo de Cenoura"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Descrição Breve
              </label>
              <textarea
                name="descricao"
                rows={2}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-medium"
                placeholder="Ex: Delicioso bolo com cobertura de chocolate..."
              />
            </div>

            <ImageUploader />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                  placeholder="Ex: 15.50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Categoria
                </label>
                <select
                  name="categoriaId"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium appearance-none"
                >
                  {categoriasDoBanco.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-[0.98] text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg shadow-primary/30"
              >
                Guardar Produto
              </button>
            </div>
          </form>
        </section>

        <section className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-800">
              Produtos no Menu
            </h2>
            <span className="bg-slate-100 text-slate-600 font-black px-4 py-1.5 rounded-full">
              {produtosDoBanco.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {produtosDoBanco.length === 0 ? (
              <p className="text-gray-500 text-center py-10 text-lg">
                Nenhum produto cadastrado ainda.
              </p>
            ) : (
              produtosDoBanco.map((produto) => (
                <div
                  key={produto.id}
                  className="group flex items-center justify-between p-4 md:p-5 bg-white border border-gray-200 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-gray-400">
                      {produto.imageUrl ? (
                        <img
                          src={produto.imageUrl}
                          alt={produto.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "FOTO"
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-800 group-hover:text-primary transition-colors">
                        {produto.name}
                      </h3>

                      <div className="flex gap-2 text-sm mt-1 items-center">
                        <span className="text-slate-800 font-black bg-gray-100 px-2 py-0.5 rounded-md">
                          R$ {produto.price.toFixed(2).replace('.', ',')}
                        </span>

                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                          {produto.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <form action={removerProduto}>
                    <input type="hidden" name="id" value={produto.id} />
                    <button
                      type="submit"
                      className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-full transition-all border border-transparent"
                    >
                      <Trash2 size={20} />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}