// app/admin/categorias/page.tsx
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { adicionarCategoria, removerCategoria } from '@/app/actions/categorias';
import { eq } from 'drizzle-orm';
import { Tags, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CategoriasPage() {
  const categoriasDoBanco = await db.select().from(categories);

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:px-12 shadow-lg flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><Tags size={28} /></div>
          Categorias
        </h1>
        <Link href="/admin" className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <ArrowLeft size={18} /> Voltar
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Nova Categoria */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-slate-800 border-b border-gray-100 pb-4">
            <Plus size={24} className="text-primary" /> Nova Categoria
          </h2>
          <form action={adicionarCategoria} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Categoria</label>
              <input type="text" name="nome" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: Bebidas Quentes" />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98]">
              Criar Categoria
            </button>
          </form>
        </section>

        {/* Lista de Categorias */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-800">Categorias Criadas</h2>
            <span className="bg-slate-100 text-slate-600 font-black px-4 py-1.5 rounded-full">{categoriasDoBanco.length}</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {categoriasDoBanco.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Nenhuma categoria criada.</p>
            ) : (
              categoriasDoBanco.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <span className="font-extrabold text-slate-800">{cat.name}</span>
                  <form action={removerCategoria} onSubmit={(e) => { if(!confirm('Tem certeza? Isso apagará todos os produtos desta categoria!')) e.preventDefault(); }}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit" className="w-10 h-10 flex items-center justify-center bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all border border-gray-200">
                      <Trash2 size={18} />
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