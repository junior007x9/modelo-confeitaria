// components/ImageUploader.tsx
'use client';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  name?: string;
  label?: string;
  defaultImage?: string | null;
}

export default function ImageUploader({ name = "imageUrl", label = "Foto", defaultImage = null }: Props) {
  const [preview, setPreview] = useState<string | null>(defaultImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-bold text-slate-700">{label}</label>
      <input type="hidden" name={name} value={preview || ''} />
      
      {preview ? (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-primary shadow-sm group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => setPreview(null)} className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
          <div className="bg-gray-100 p-4 rounded-full group-hover:bg-primary/10 transition-colors mb-3">
            <Upload size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">Clique para enviar</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      )}
    </div>
  );
}