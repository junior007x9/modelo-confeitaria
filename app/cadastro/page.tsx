// app/cadastro/page.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { realizarCadastro } from '@/app/actions/auth';

export default function CadastroPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await realizarCadastro(formData);
      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        // Se cadastrou com sucesso, enviamos para o login!
        router.push('/login');
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-primary/5 relative z-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Crie sua loja</h1>
          <p className="text-gray-500 font-medium mt-1">Comece a vender em minutos</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-fade-up">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
            <input 
              type="text" name="nome" required 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
              placeholder="Ex: João da Silva" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">E-mail Profissional</label>
            <input 
              type="email" name="email" required 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
              placeholder="seu@email.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
            <input 
              type="password" name="senha" required minLength={6}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
              placeholder="Mínimo de 6 caracteres" 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] text-white font-black text-lg py-4 rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                <>Criar Conta <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary hover:text-secondary font-black transition-colors">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}