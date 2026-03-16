// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores neutras que o cliente final poderá alterar depois
        primary: "#d946ef", // Um tom de rosa/fúcsia genérico para confeitaria
        secondary: "#a21caf", 
        background: "#f8fafc", 
        surface: "#ffffff", 
        text: "#1e293b", 
      },
    },
  },
  plugins: [],
};
export default config;