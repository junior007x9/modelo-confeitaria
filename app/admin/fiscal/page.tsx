// app/admin/fiscal/page.tsx
import { getSettings, updateFiscalSettings } from '@/app/actions/config';
import { ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import CertificateUploader from '@/components/CertificateUploader';

export default async function FiscalPage() {
  const settings = await getSettings();
  const hasCert = !!settings.certificadoA1;

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:px-12 shadow-lg flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl"><ShieldCheck size={28} /></div>
          Configuração Fiscal
        </h1>
        <Link href="/admin" className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <ArrowLeft size={18} /> Voltar
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        
        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-5 rounded-2xl mb-8 flex gap-4 items-start shadow-sm">
          <Building2 size={24} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">Emissão de Notas Fiscais</h3>
            <p className="text-sm font-medium opacity-80">Preencha com os dados exatos do seu CNPJ para habilitar a emissão de NFC-e/NFS-e automática pelo sistema.</p>
          </div>
        </div>

        <form action={updateFiscalSettings} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Razão Social (Como está no CNPJ)</label>
              <input type="text" name="razaoSocial" defaultValue={settings.razaoSocial || ''} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary font-medium" placeholder="Ex: CONFEITARIA DOCE SABOR LTDA" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">CNPJ (Apenas números)</label>
              <input type="text" name="cnpj" defaultValue={settings.cnpj || ''} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary font-medium" placeholder="00.000.000/0001-00" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ambiente Fiscal</label>
              <select name="ambienteFiscal" defaultValue={settings.ambienteFiscal || 'homologacao'} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary font-medium appearance-none">
                <option value="homologacao">🧪 Homologação (Ambiente de Testes)</option>
                <option value="producao">🚀 Produção (Emitir com valor legal)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Inscrição Estadual (IE)</label>
              <input type="text" name="inscricaoEstadual" defaultValue={settings.inscricaoEstadual || ''} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary font-medium" placeholder="Opcional se for MEI" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Inscrição Municipal (IM)</label>
              <input type="text" name="inscricaoMunicipal" defaultValue={settings.inscricaoMunicipal || ''} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary font-medium" placeholder="Para serviços" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="md:col-span-2 lg:col-span-1">
              <CertificateUploader hasExistingCert={hasCert} />
            </div>
            
            <div className="md:col-span-2 lg:col-span-1 h-full flex flex-col justify-end pb-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha do Certificado Digital</label>
              <input type="password" name="senhaCertificado" defaultValue={settings.senhaCertificado || ''} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary font-medium" placeholder="••••••••" />
              <p className="text-xs text-gray-400 font-medium mt-2">Sua senha é criptografada e não pode ser lida por nós.</p>
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98]">
            Salvar Dados Fiscais
          </button>
        </form>
      </div>
    </main>
  );
}