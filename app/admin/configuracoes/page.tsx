// app/admin/configuracoes/page.tsx
import { getSettings } from '@/app/actions/config';
import { updateSettings } from '@/app/actions/config';
import { Store, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

export default async function ConfigPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:px-12 shadow-lg flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><Settings size={28} /></div>
          Personalizar Loja
        </h1>
        <Link href="/admin" className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <ArrowLeft size={18} /> Voltar
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <form action={updateSettings} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Loja</label>
              <input type="text" name="storeName" defaultValue={settings.storeName} required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp (com DDD)</label>
              <input type="text" name="whatsapp" defaultValue={settings.whatsapp} required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: 5511999999999" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Endereço Completo</label>
              <input type="text" name="address" defaultValue={settings.address} required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Cor Principal (Botões)</label>
              <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="w-full h-14 rounded-xl cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Cor Secundária (Gradientes)</label>
              <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor} className="w-full h-14 rounded-xl cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <ImageUploader name="coverImage" label="Imagem de Capa (Banner)" defaultImage={settings.coverImage} />
            <ImageUploader name="logoImage" label="Logomarca" defaultImage={settings.logoImage} />
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98]">
            Salvar Configurações
          </button>
        </form>
      </div>
    </main>
  );
}