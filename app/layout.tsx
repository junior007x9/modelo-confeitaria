// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from '@/app/actions/config';
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sua Loja",
  description: "Faça seu pedido online",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    // INJETAMOS AS CORES DINAMICAMENTE AQUI
    <html lang="pt-BR" style={{
      '--color-primary': settings.primaryColor,
      '--color-secondary': settings.secondaryColor
    } as React.CSSProperties}>
      <body className={`${inter.className} bg-background`}>
        <div className="w-full min-h-screen relative">
          {children}
        </div>
        <WhatsAppButton phone={settings.whatsapp} />
      </body>
    </html>
  );
}