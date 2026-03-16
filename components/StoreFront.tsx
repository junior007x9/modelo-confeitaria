// components/StoreFront.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Clock, Info, MapPin, Search, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCartStore, Product } from '@/store/useCartStore';

interface Categoria {
  id: string;
  name: string;
}

interface StoreFrontProps {
  produtos: Product[];
  settings: any;
  categorias: Categoria[]; // <-- Recebendo as categorias do banco
}

export default function StoreFront({ produtos, settings, categorias }: StoreFrontProps) {
  const { addItem, totalItems, totalPrice } = useCartStore();
  const itensNoCarrinho = totalItems();
  const valorTotal = totalPrice();
  
  // Estado para controlar o filtro visual
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  // Filtragem dos produtos
  const produtosFiltrados = categoriaAtiva === 'Todos' 
    ? produtos 
    : produtos.filter(p => p.category === categoriaAtiva);

  return (
    <main className="pb-32 bg-background min-h-screen font-sans">
      
      <header className="relative w-full">
        <div className="h-56 md:h-72 lg:h-80 w-full flex items-center justify-center relative overflow-hidden bg-slate-900">
          {settings?.coverImage && <img src={settings.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Capa" />}
          <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-primary/40 via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          {!settings?.coverImage && <span className="text-white/40 z-20 font-medium tracking-widest uppercase">[Sua Imagem de Capa]</span>}
        </div>
        
        <div className="absolute -bottom-14 md:-bottom-16 left-4 md:left-8 lg:left-12 w-28 h-28 md:w-36 md:h-36 bg-surface rounded-full border-4 md:border-8 border-background shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105 hover:rotate-3 z-30">
           {settings?.logoImage ? <img src={settings.logoImage} className="w-full h-full object-cover" alt="Logo" /> : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-black text-sm md:text-xl text-center leading-tight">LOGO<br/>AQUI</div>}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 mt-16 md:mt-20">
        
        <section className="pb-6 border-b border-gray-100/80 animate-fade-up" style={{ opacity: 0 }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">{settings?.storeName || 'Nome da Empresa'}</h1>
              <p className="text-base text-gray-500 flex items-center gap-1.5 font-medium">
                <MapPin size={18} className="text-primary" /> {settings?.address || 'Seu endereço completo aqui...'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-100/80 px-4 py-2 rounded-2xl shadow-sm border border-green-200/50">
                <Clock size={18} /> Aberto agora
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-bold bg-white border border-gray-200/80 px-4 py-2 rounded-2xl shadow-sm">
                <Info size={18} /> Ped Mín: R$ 20,00
              </span>
            </div>
          </div>
        </section>

        {/* Categoria Interativa */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl py-4 mt-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-100/50 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <nav className="w-full md:w-auto flex gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {/* Botão "Todos" Fixo */}
            <button 
              onClick={() => setCategoriaAtiva('Todos')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                categoriaAtiva === 'Todos' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-white text-slate-600 hover:bg-gray-50 hover:text-primary border border-gray-200/80 hover:scale-105 hover:shadow-sm'
              }`}
            >
              Todos
            </button>
            
            {/* Categorias do Banco */}
            {categorias.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.name)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  categoriaAtiva === cat.name ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-white text-slate-600 hover:bg-gray-50 hover:text-primary border border-gray-200/80 hover:scale-105 hover:shadow-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>

          <div className="relative w-full md:max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input type="text" placeholder="Buscar delícias..." className="w-full bg-white border border-gray-200/80 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" />
          </div>
        </div>

        {/* Vitrine Filtrada */}
        <section className="py-8">
          {produtosFiltrados.length === 0 ? (
             <div className="text-center py-10">
               <p className="text-gray-500 font-bold text-lg">Nenhum produto nesta categoria no momento.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {produtosFiltrados.map((produto, index) => (
                <article key={produto.id} className="animate-fade-up group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-gray-100 overflow-hidden flex flex-row md:flex-col cursor-pointer" style={{ animationDelay: `${(index + 2) * 50}ms`, opacity: 0 }} onClick={() => addItem(produto)}>
                  <div className="w-32 md:w-full md:h-60 bg-slate-100 shrink-0 relative overflow-hidden">
                    {produto.imageUrl ? <img src={produto.imageUrl} alt={produto.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out bg-slate-100"><span className="text-xs md:text-sm font-medium uppercase tracking-widest opacity-50">[FOTO]</span></div>}
                    <div className="absolute top-4 left-4 hidden md:block z-10"><span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm">{produto.category}</span></div>
                  </div>
                  <div className="p-5 md:p-7 flex flex-col flex-grow justify-between bg-white relative">
                    <div>
                      <h3 className="font-black text-slate-800 text-lg md:text-xl leading-tight group-hover:text-primary transition-colors">{produto.name}</h3>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{produto.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden md:block mb-0.5">Preço</span>
                        <span className="font-black text-2xl text-slate-800"><span className="text-sm font-bold text-slate-400 mr-1">R$</span>{produto.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <button className="relative overflow-hidden bg-primary/10 text-primary md:bg-slate-900 md:text-white px-5 py-3 rounded-2xl text-sm font-black md:shadow-lg md:hover:shadow-primary/40 md:hover:bg-primary transition-all duration-300 active:scale-90 flex items-center gap-2 group/btn">
                        <span className="relative z-10 flex items-center gap-1"><span className="md:hidden">+</span> <span className="hidden md:inline">Adicionar</span><ChevronRight size={16} className="hidden md:inline group-hover/btn:translate-x-1 transition-transform" /></span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite] hidden md:block"></div>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>

      {itensNoCarrinho > 0 && (
        <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 p-6 md:p-8 pointer-events-none animate-fade-up" style={{ animationDelay: '200ms' }}>
          <Link href="/carrinho" className="animate-float w-full md:w-auto md:min-w-[480px] bg-gradient-to-r from-primary to-secondary text-white p-4 md:px-8 md:py-5 rounded-full shadow-[0_10px_40px_-10px_rgba(var(--color-primary),0.6)] flex items-center justify-between pointer-events-auto cursor-pointer hover:scale-[1.03] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="relative bg-white/20 p-3 rounded-full backdrop-blur-md">
                <ShoppingBag size={24} className="text-white" />
                <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg">{itensNoCarrinho}</span>
              </div>
              <div className="flex flex-col"><span className="font-black md:text-lg leading-none">Ver meu pedido</span><span className="text-white/80 text-xs font-bold uppercase tracking-wider mt-1">Finalizar compra</span></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-2xl bg-white/10 px-5 py-2 rounded-full backdrop-blur-md"><span className="text-sm font-bold text-white/70 mr-1">R$</span>{valorTotal.toFixed(2).replace('.', ',')}</span>
              <ChevronRight size={24} className="opacity-70" />
            </div>
          </Link>
        </div>
      )}
    </main>
  );
}