// db/schema.ts
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  imageUrl: text('image_url'),
  categoryId: text('category_id').references(() => categories.id),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  resetToken: text('reset_token'),
  resetTokenExpiry: integer('reset_token_expiry', { mode: 'timestamp' }),
});

export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey(),
  storeName: text('store_name').notNull().default('Minha Confeitaria'),
  address: text('address').notNull().default('Endereço a definir...'),
  whatsapp: text('whatsapp').notNull().default('5511999999999'),
  primaryColor: text('primary_color').notNull().default('#f43f5e'),
  secondaryColor: text('secondary_color').notNull().default('#fb7185'),
  coverImage: text('cover_image'),
  logoImage: text('logo_image'),
  
  // NOVOS CAMPOS: CONFIGURAÇÃO FISCAL
  cnpj: text('cnpj'),
  razaoSocial: text('razao_social'),
  inscricaoEstadual: text('inscricao_estadual'),
  inscricaoMunicipal: text('inscricao_municipal'),
  ambienteFiscal: text('ambiente_fiscal').default('homologacao'), // 'homologacao' (Testes) ou 'producao' (Valendo)
  certificadoA1: text('certificado_a1'), // Arquivo .pfx convertido em texto
  senhaCertificado: text('senha_certificado'),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  deliveryType: text('delivery_type').notNull(),
  address: text('address'),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull().default('RECEBIDO'),
  invoiceUrl: text('invoice_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
});