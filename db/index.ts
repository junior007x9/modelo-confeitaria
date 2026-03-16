// db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Se a URL do Turso não estiver carregada (como ao rodar o script npx tsx), nós forçamos a leitura do .env.local
if (!process.env.TURSO_DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

// Cria o cliente conectando na URL e Token
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Exporta o banco de dados pronto para usarmos em qualquer parte do site
export const db = drizzle(client, { schema });