// app/admin/pedidos/page.tsx
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { atualizarStatusPedido, emitirNotaFiscal } from '@/app/actions/pedidos';
import { FileText, ArrowLeft, Receipt, ExternalLink, Clock, Package, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function PedidosPage() {
  // Busca todos os pedidos, do mais novo para o mais velho
  const todosPedidos = await db.select().from(orders).orderBy(desc(orders.createdAt));
  
  // Para cada pedido, busca os itens
  const pedidosComItens = await Promise.all(
    todosPedidos.map(async (pedido) => {
      const itens = await db.select().from(orderItems).where(eq(orderItems.orderId, pedido.id));
      return { ...pedido, itens };
    })
  );

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:px-12 shadow-lg flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><Receipt size={28} /></div>
          Gestão de Pedidos
        </h1>
        <Link href="/admin" className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <ArrowLeft size={18} /> Voltar
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {pedidosComItens.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Nenhum pedido ainda</h2>
            <p className="text-gray-500 mt-2">Os pedidos dos seus clientes aparecerão aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pedidosComItens.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all">
                
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">#{pedido.id.replace('ped-', '')}</span>
                    <h3 className="text-xl font-extrabold text-slate-800 mt-1">{pedido.customerName}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
                      {pedido.deliveryType === 'entrega' ? <span className="text-blue-500">🛵 Delivery</span> : <span className="text-green-500">🏪 Retirada</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-primary">R$ {pedido.totalAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="flex-grow space-y-2 mb-6">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-bold text-slate-700">{item.quantity}x {item.productName}</span>
                      <span className="text-gray-500">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                  {pedido.address && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-slate-600 font-medium">
                      📍 {pedido.address}
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  {/* Troca de Status Rápida */}
                  <form action={async () => {
                    'use server';
                    const novoStatus = pedido.status === 'RECEBIDO' ? 'PREPARANDO' : pedido.status === 'PREPARANDO' ? 'PRONTO' : 'RECEBIDO';
                    await atualizarStatusPedido(pedido.id, novoStatus);
                  }}>
                    <button type="submit" className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                      pedido.status === 'RECEBIDO' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                      pedido.status === 'PREPARANDO' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                      'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}>
                      {pedido.status === 'RECEBIDO' && <><Clock size={18} /> Marcar como Preparando</>}
                      {pedido.status === 'PREPARANDO' && <><Package size={18} /> Marcar como Pronto</>}
                      {pedido.status === 'PRONTO' && <><CheckCircle2 size={18} /> Pedido Finalizado</>}
                    </button>
                  </form>

                  {/* Integração Fiscal */}
                  {pedido.invoiceUrl ? (
                     <a href={pedido.invoiceUrl} target="_blank" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                       <FileText size={18} className="text-green-600" /> Ver Nota Fiscal Gerada
                     </a>
                  ) : (
                    <form action={async () => {
                      'use server';
                      await emitirNotaFiscal(pedido.id);
                    }}>
                      <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
                        <FileText size={18} /> Emitir Nota Fiscal (NF-e)
                      </button>
                    </form>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}