// app/carrinho/page.tsx
'use client';

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, Store } from 'lucide-react';
import { useState } from 'react';

export default function Carrinho() {
  const { items, removeItem, addItem, totalPrice } = useCartStore();
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');

  const valorItens = totalPrice();
  const taxaEntrega = tipoEntrega === 'entrega' ? 5.00 : 0;
  const valorTotal = valorItens + taxaEntrega;

  // Função para diminuir a quantidade (remove se for 1)
  const handleDiminuir = (produto: any) => {
    if (produto.quantity > 1) {
      // Como nosso store atual só tem "addItem" e "removeItem", 
      // precisaremos adicionar a função de decrementar depois. 
      // Por enquanto, vamos remover se clicar na lixeira.
    }
  };

  // Monta a mensagem para o WhatsApp
  const finalizarPedido = () => {
    if (tipoEntrega === 'entrega' && !endereco.trim()) {
      alert('Por favor, preencha o endereço de entrega.');
      return;
    }
    
    let mensagem = `*Novo Pedido - Nome da Empresa*\n\n`;
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

    const telefoneDaLoja = "5511999999999";
    const url = `https://wa.me/${telefoneDaLoja}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  // Se o carrinho estiver vazio
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Trash2 size={40} className="text-gray-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-8">Adicione algumas delícias para fazer seu pedido.</p>
        <Link 
          href="/" 
          className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
          aria-label="Voltar para o cardápio inicial"
        >
          Voltar para o Cardápio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* Cabeçalho Acessível */}
      <header className="bg-surface sticky top-0 z-40 px-4 py-4 flex items-center gap-4 shadow-sm">
        <Link 
          href="/" 
          className="p-2 -ml-2 text-gray-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-bold text-text">Seu Pedido</h1>
      </header>

      {/* Lista de Produtos */}
      <section className="p-4" aria-label="Itens no carrinho">
        <div className="bg-surface rounded-2xl p-2 shadow-sm border border-gray-100">
          {items.map((item) => (
            <article key={item.id} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0">
              <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0 flex items-center justify-center text-xs text-gray-400">
                Foto
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-text text-sm leading-tight">{item.name}</h2>
                <p className="text-primary font-bold mt-1 text-sm">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
              
              {/* Controles de Quantidade (Grandes para Touch) */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label={`Remover ${item.name} do carrinho`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
                <span className="font-bold text-sm min-w-[1rem] text-center" aria-live="polite">
                  {item.quantity}
                </span>
                <button 
                  onClick={() => addItem(item)} // Reaproveitando a função addItem que já incrementa
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-primary shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Adicionar mais um ${item.name}`}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Opções de Entrega */}
      <section className="p-4 pt-0" aria-label="Opções de entrega">
        <div className="bg-surface rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold text-text mb-4">Como deseja receber?</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setTipoEntrega('entrega')}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                tipoEntrega === 'entrega' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500'
              }`}
              aria-pressed={tipoEntrega === 'entrega'}
            >
              <MapPin size={24} aria-hidden="true" />
              <span className="font-bold text-sm">Entregar</span>
            </button>
            <button
              onClick={() => setTipoEntrega('retirada')}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                tipoEntrega === 'retirada' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500'
              }`}
              aria-pressed={tipoEntrega === 'retirada'}
            >
              <Store size={24} aria-hidden="true" />
              <span className="font-bold text-sm">Retirar na Loja</span>
            </button>
          </div>

          {/* Formulário Dinâmico Acessível */}
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
              <input 
                id="nome"
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {tipoEntrega === 'entrega' && (
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                <textarea 
                  id="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, Número, Bairro, Complemento"
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  required
                  aria-required="true"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resumo e Botão Flutuante */}
      <footer className="fixed bottom-0 left-0 w-full flex justify-center z-50 bg-surface border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-2xl flex flex-col gap-3">
          
          <div className="flex justify-between items-center text-sm text-gray-500 px-2">
            <span>Subtotal</span>
            <span>R$ {valorItens.toFixed(2).replace('.', ',')}</span>
          </div>
          {tipoEntrega === 'entrega' && (
            <div className="flex justify-between items-center text-sm text-gray-500 px-2">
              <span>Taxa de entrega</span>
              <span>R$ {taxaEntrega.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          
          <button 
            onClick={finalizarPedido}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl flex items-center justify-between px-6 transition-colors shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
            aria-label={`Finalizar pedido pelo WhatsApp no valor de R$ ${valorTotal.toFixed(2).replace('.', ',')}`}
          >
            <span>Finalizar no WhatsApp</span>
            <span className="text-lg">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </footer>
    </main>
  );
}