import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";

// Все кастомные плагины копирования и остатки Manus полностью удалены

export default defineConfig({
  plugins: [react(), tailwindcss(), jsxLocPlugin()],
  resolve: { 
    alias: { "@": path.resolve(import.meta.dirname, "client", "src") } 
  },
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, 'client', 'public'),
  build: { 
    // Возвращаем стандартный корень вывода. Теперь index.html будет лежать строго в dist/
    outDir: path.resolve(import.meta.dirname, "dist"), 
    emptyOutDir: true 
  },
  server: {
    allowedHosts: true
  }
});