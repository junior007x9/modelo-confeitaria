// components/WhatsAppButton.tsx
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  // Número genérico de exemplo
  const phone = "5511999999999";
  const message = "Olá! Gostaria de tirar uma dúvida sobre um pedido.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}