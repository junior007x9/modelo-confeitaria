// app/actions/config.ts
'use server';

import { db } from '@/db';
import { storeSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  let settings = await db.select().from(storeSettings).where(eq(storeSettings.id, 'default'));
  if (settings.length === 0) {
    await db.insert(storeSettings).values({ id: 'default' });
    settings = await db.select().from(storeSettings).where(eq(storeSettings.id, 'default'));
  }
  return settings[0];
}

export async function updateSettings(formData: FormData) {
  const storeName = formData.get('storeName') as string;
  const address = formData.get('address') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const primaryColor = formData.get('primaryColor') as string;
  const secondaryColor = formData.get('secondaryColor') as string;
  const coverImage = formData.get('coverImage') as string;
  const logoImage = formData.get('logoImage') as string;

  const updateData: any = { storeName, address, whatsapp, primaryColor, secondaryColor };
  if (coverImage) updateData.coverImage = coverImage;
  if (logoImage) updateData.logoImage = logoImage;

  await db.update(storeSettings).set(updateData).where(eq(storeSettings.id, 'default'));
  revalidatePath('/', 'layout');
}

// NOVA FUNÇÃO: Salvar Configurações Fiscais
export async function updateFiscalSettings(formData: FormData) {
  const cnpj = formData.get('cnpj') as string;
  const razaoSocial = formData.get('razaoSocial') as string;
  const inscricaoEstadual = formData.get('inscricaoEstadual') as string;
  const inscricaoMunicipal = formData.get('inscricaoMunicipal') as string;
  const ambienteFiscal = formData.get('ambienteFiscal') as string;
  const senhaCertificado = formData.get('senhaCertificado') as string;
  const certificadoA1 = formData.get('certificadoA1') as string; // Arquivo pfx

  const updateData: any = { cnpj, razaoSocial, inscricaoEstadual, inscricaoMunicipal, ambienteFiscal, senhaCertificado };
  if (certificadoA1) updateData.certificadoA1 = certificadoA1;

  await db.update(storeSettings).set(updateData).where(eq(storeSettings.id, 'default'));
  revalidatePath('/admin/fiscal');
}