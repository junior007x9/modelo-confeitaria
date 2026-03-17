// app/carrinho/page.tsx
'use client';

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, MapPin, Store, ShoppingBag, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { criarPedido } from '@/app/actions/pedidos';

export default function Carrinho() {
  const { items, removeItem, addItem, totalPrice, clearCart } = useCartStore();
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [carregando, setCarregando] = useState(false); // Estado para o botão de loading

  const valorItens = totalPrice();
  const taxaEntrega = tipoEntrega === 'entrega' ? 5.00 : 0;
  const valorTotal = valorItens + taxaEntrega;

  const finalizarPedido = async () => {
    if (!nome.trim()) {
      alert('Por favor, preencha o seu nome.');
      return;
    }
    if (tipoEntrega === 'entrega' && !endereco.trim()) {
      alert('Por favor, preencha o endereço de entrega.');
      return;
    }
    
    setCarregando(true); // Ativa o loading no botão

    try {
      // 1. Salva o pedido no banco de dados
      const orderId = await criarPedido({ nome, tipoEntrega, endereco, valorTotal }, items);
      
      // 2. Monta a mensagem para o WhatsApp com o número do pedido real gerado pelo banco
      let mensagem = `*Novo Pedido: #${orderId.replace('ped-', '')}*\n\n`;
      mensagem += `*Cliente:* ${nome || 'Não informado'}\n`;
      mensagem += `*Tipo:* ${tipoEntrega === 'entrega' ? 'Delivery 🛵' : 'Retirada na Loja 🏪'}\n\n`;
      mensagem += `*Itens do Pedido:*\n`;
      
      items.forEach(item => {
        mensagem += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      });

      mensagem += `\n*Subtotal:* R$ ${valorItens.toFixed(2)}\n`;
      if (tipoEntrega === 'entrega') mensagem += `*Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
      mensagem += `*Total a Pagar:* R$ ${valorTotal.toFixed(2)}\n\n`;
      
      if (tipoEntrega === 'entrega') {
        mensagem += `*Endereço:* ${endereco}`;
      }

      // 3. Limpa o carrinho
      clearCart();

      // 4. Redireciona para o WhatsApp
      const telefoneDaLoja = "5511999999999"; // Depois podemos puxar isso das settings também
      const url = `https://wa.me/${telefoneDaLoja}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
      
      // 5. Volta para a página inicial
      window.location.href = "/";
      
    } catch (error) {
      console.error(error);
      alert('Erro ao processar o pedido. Por favor, tente novamente ou verifique o terminal do servidor.');
    } finally {
      setCarregando(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShoppingBag size={56} className="text-primary/50" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-10 text-lg">Que tal adicionar algumas delícias da nossa vitrine?</p>
        <Link 
          href="/" 
          className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        >
          Explorar Cardápio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pb-32">
      <header className="bg-white sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center gap-4 shadow-sm border-b border-gray-100">
        <Link 
          href="/" 
          className="p-2 -ml-2 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors rounded-full"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Finalizar Pedido</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        <section className="flex-1" aria-label="Itens no carrinho">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="text-primary" size={24} /> Seus Itens
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 md:gap-6 group hover:shadow-md transition-all">
                <div className="w-full sm:w-24 sm:h-24 h-40 bg-gray-100 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-gray-400">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    "[FOTO]"
                  )}
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{item.name}</h3>
                  <p className="text-primary font-black mt-2 text-lg">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 rounded-full p-2 border border-gray-100 w-full sm:w-auto justify-center">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-red-500 shadow-sm active:scale-95 hover:bg-red-50 transition-colors"
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                  <span className="font-bold text-lg min-w-[1.5rem] text-center" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => addItem(item)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-primary shadow-sm active:scale-95 hover:bg-primary/5 transition-colors"
                    aria-label={`Adicionar mais um ${item.name}`}
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="w-full lg:w-[400px] xl:w-[450px]" aria-label="Opções de entrega e pagamento">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Como deseja receber?</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setTipoEntrega('entrega')}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  tipoEntrega === 'entrega' ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 text-primary shadow-inner' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <MapPin size={28} />
                <span className="font-bold text-sm">Entregar</span>
              </button>
              <button
                onClick={() => setTipoEntrega('retirada')}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  tipoEntrega === 'retirada' ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 text-primary shadow-inner' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Store size={28} />
                <span className="font-bold text-sm">Retirar na Loja</span>
              </button>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label htmlFor="nome" className="block text-sm font-bold text-slate-700 mb-2">Seu Nome</label>
                <input 
                  id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                />
              </div>

              {tipoEntrega === 'entrega' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label htmlFor="endereco" className="block text-sm font-bold text-slate-700 mb-2">Endereço Completo</label>
                  <textarea 
                    id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, Número, Bairro, Complemento" rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-medium"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3 mb-8">
              <div className="flex justify-between items-center text-gray-500 font-medium text-lg">
                <span>Subtotal</span>
                <span>R$ {valorItens.toFixed(2).replace('.', ',')}</span>
              </div>
              {tipoEntrega === 'entrega' && (
                <div className="flex justify-between items-center text-gray-500 font-medium text-lg">
                  <span>Taxa de entrega</span>
                  <span>R$ {taxaEntrega.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-slate-800 font-black text-2xl pt-2">
                <span>Total</span>
                <span className="text-primary">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button 
              onClick={finalizarPedido}
              disabled={carregando}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-black text-lg py-5 rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {carregando ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Finalizar no WhatsApp"
              )}
            </button>
          </div>
        </aside>

      </div>
    </main>
  );
}