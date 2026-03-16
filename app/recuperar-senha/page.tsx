// app/recuperar-senha/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function RecuperarSenhaPage() {
  const [enviado, setEnviado] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro entrará a lógica de disparar um email de verdade.
    // Por enquanto, simulamos um sucesso instantâneo!
    setEnviado(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-primary/5 relative z-10 border border-gray-100">
        
        {enviado ? (
          <div className="flex flex-col items-center text-center animate-fade-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-lg shadow-green-500/20">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">E-mail Enviado!</h1>
            <p className="text-gray-500 font-medium mb-8">
              Enviamos um link de recuperação para <strong className="text-slate-700">{email}</strong>. Por favor, verifique sua caixa de entrada e spam.
            </p>
            <Link 
              href="/login" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} /> Voltar para o Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 mb-4">
                <Store size={32} />
              </div>
              <h1 className="text-2xl font-black text-slate-800">Esqueceu a senha?</h1>
              <p className="text-gray-500 font-medium mt-1 text-center">Digite seu e-mail e enviaremos um link de recuperação.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail Cadastrado</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
                  placeholder="seu@email.com" 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-secondary text-white font-black text-lg py-4 rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Enviar Link <Mail size={20} />
                </button>
              </div>
            </form>

            <Link href="/login" className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500 font-bold hover:text-slate-800 transition-colors">
              <ArrowLeft size={16} /> Voltar para o login
            </Link>
          </>
        )}

      </div>
    </main>
  );
}