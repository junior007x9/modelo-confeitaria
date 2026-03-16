// components/Navbar.tsx
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-surface shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Genérica */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Doce Sabor
        </Link>

        {/* Links de Navegação */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <Link href="/cardapio" className="hover:text-primary transition-colors">Cardápio</Link>
          <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
        </nav>

        {/* Ícone do Carrinho */}
        <div className="flex items-center gap-4">
          <Link href="/carrinho" className="relative p-2 text-text hover:text-primary transition-colors">
            <ShoppingCart size={24} />
            {/* Bolinha com a quantidade do carrinho (estática por enquanto) */}
            <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
          
          {/* Menu Mobile (Apenas visual por enquanto) */}
          <button className="md:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}