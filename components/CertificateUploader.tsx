// components/CertificateUploader.tsx
'use client';
import { useState } from 'react';
import { FileKey2, Upload, CheckCircle2 } from 'lucide-react';

interface Props {
  hasExistingCert?: boolean;
}

export default function CertificateUploader({ hasExistingCert = false }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    // Converte o arquivo .pfx para Base64 para enviarmos seguro para a API depois
    const reader = new FileReader();
    reader.onloadend = () => setBase64File(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-bold text-slate-700">Certificado Digital A1 (.pfx)</label>
      <input type="hidden" name="certificadoA1" value={base64File || ''} />
      
      <label className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group ${fileName || hasExistingCert ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}>
        
        {fileName || hasExistingCert ? (
          <>
            <div className="bg-green-100 p-3 rounded-full text-green-600 mb-3 shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <span className="text-sm font-bold text-green-700">
              {fileName ? `Arquivo selecionado: ${fileName}` : 'Certificado já instalado no sistema!'}
            </span>
            <span className="text-xs text-green-600/70 mt-1 font-medium">Clique para substituir</span>
          </>
        ) : (
          <>
            <div className="bg-gray-100 p-4 rounded-full group-hover:bg-primary/10 transition-colors mb-3">
              <FileKey2 size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">Clique para enviar o arquivo .pfx</span>
            <span className="text-xs text-gray-400 mt-1">Obrigatório para emissão de notas</span>
          </>
        )}
        <input type="file" accept=".pfx" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}