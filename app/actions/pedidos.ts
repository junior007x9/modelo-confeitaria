// app/actions/pedidos.ts
'use server';

import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Salvar o pedido no banco (Mantido igual)
export async function criarPedido(dados: any, itens: any[]) {
  try {
    const orderId = `ped-${Date.now()}`;
    
    await db.insert(orders).values({
      id: orderId,
      customerName: dados.nome,
      deliveryType: dados.tipoEntrega,
      address: dados.endereco,
      totalAmount: dados.valorTotal,
      createdAt: new Date(),
    });

    const itensParaSalvar = itens.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      orderId: orderId,
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    await db.insert(orderItems).values(itensParaSalvar);
    return orderId;

  } catch (error) {
    console.error("❌ ERRO AO SALVAR PEDIDO:", error);
    throw new Error("Falha ao salvar no banco de dados.");
  }
}

export async function atualizarStatusPedido(orderId: string, novoStatus: string) {
  await db.update(orders).set({ status: novoStatus }).where(eq(orders.id, orderId));
  revalidatePath('/admin/pedidos');
}

// 3. EMISSÃO REAL DE NOTA FISCAL (Integração via API)
export async function emitirNotaFiscal(orderId: string) {
  try {
    // 1. Buscamos os dados completos do pedido e itens no nosso banco
    const pedido = await db.select().from(orders).where(eq(orders.id, orderId));
    const itens = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    if (!pedido || pedido.length === 0) throw new Error("Pedido não encontrado");

    // 2. Montamos o "Payload" (Pacote de dados exigido pelo Governo)
    // Nota: Estamos usando o formato NFC-e (Nota de Consumidor) que é o padrão para comércio/alimentação.
    // Se a empresa fosse exclusivamente de serviços (ex: consultoria), seria o endpoint de NFS-e.
    const dadosDaNota = {
      natureza_operacao: "Venda de mercadorias",
      data_emissao: new Date().toISOString(),
      tipo_documento: "1", // 1 = Saída
      local_destino: "1", // 1 = Operação interna (mesmo estado)
      consumidor_final: "1", // 1 = Sim
      presenca_comprador: "1", // 1 = Operação presencial
      
      // Dados do Cliente (No mundo real, pegariamos CPF/CNPJ se o cliente informasse)
      nome_destinatario: pedido[0].customerName,
      
      // Mapeando os itens do nosso carrinho para o padrão fiscal
      itens: itens.map((item, index) => ({
        numero_item: (index + 1).toString(),
        codigo_produto: item.productId,
        descricao: item.productName,
        cfop: "5102", // CFOP padrão para venda de mercadoria adquirida de terceiros
        unidade_comercial: "UN",
        quantidade_comercial: item.quantity.toString(),
        valor_unitario_comercial: item.price.toString(),
        valor_bruto: (item.price * item.quantity).toString(),
        icms_origem: "0",
        icms_situacao_tributaria: "102", // Simples Nacional (padrão MEI/Microempresa)
      })),
      
      formas_pagamento: [{
        forma_pagamento: "01", // 01 = Dinheiro (Ajustar conforme o meio real usado)
        valor_pagamento: pedido[0].totalAmount.toString()
      }]
    };

    // 3. Disparamos a nota para a API oficial (Ex: Focus NFe)
    // O Token é convertido em Base64 como manda a documentação de segurança
    const tokenBase64 = Buffer.from(`${process.env.API_NFE_TOKEN}:`).toString('base64');
    
    // Para testar sem a conta real configurada, vamos simular o retorno de sucesso (Mock)
    // APAGUE ESTA LINHA E DESCOMENTE O FETCH ABAIXO QUANDO TIVER A CONTA DA API:
    const mockRetornoSefaz = { status: "autorizado", caminho_danfe: `https://api.focusnfe.com.br/arquivos/danfe_${orderId}_homologacao.pdf` };
    
    /* CÓDIGO REAL DE PRODUÇÃO (Descomente quando tiver as chaves):
    const response = await fetch(`${process.env.API_NFE_URL}/v2/nfe?ref=${orderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${tokenBase64}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosDaNota)
    });

    const mockRetornoSefaz = await response.json();
    if (!response.ok) {
      console.error("Erro da SEFAZ:", mockRetornoSefaz);
      throw new Error(mockRetornoSefaz.mensagem || "Erro ao autorizar nota na SEFAZ.");
    }
    */

    // 4. Se deu tudo certo, salva o link verdadeiro do PDF no nosso banco
    if (mockRetornoSefaz.status === "autorizado" || mockRetornoSefaz.caminho_danfe) {
      await db.update(orders).set({ invoiceUrl: mockRetornoSefaz.caminho_danfe }).where(eq(orders.id, orderId));
      revalidatePath('/admin/pedidos');
      return { success: true, url: mockRetornoSefaz.caminho_danfe };
    }

    throw new Error("Nota em processamento ou com erro na SEFAZ.");

  } catch (error) {
    console.error("❌ ERRO NA EMISSÃO FISCAL:", error);
    throw new Error("Falha na comunicação com a SEFAZ.");
  }
}