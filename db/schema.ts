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

// NOVA TABELA: Configurações da Loja
export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey(),
  storeName: text('store_name').notNull().default('Minha Confeitaria'),
  address: text('address').notNull().default('Endereço a definir...'),
  whatsapp: text('whatsapp').notNull().default('5511999999999'),
  primaryColor: text('primary_color').notNull().default('#f43f5e'),
  secondaryColor: text('secondary_color').notNull().default('#fb7185'),
  coverImage: text('cover_image'),
  logoImage: text('logo_image'),
});