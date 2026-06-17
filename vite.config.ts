import fs from "fs";
import path from "path"; // Убедись, что импорт path есть в начале файла
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// ... (оставь свои остальные импорты)

const copyPublicPlugin = {
  name: 'copy-public',
  apply: 'build',
  enforce: 'post',
  writeBundle() {
    // Теперь пути указывают строго внутри папки client
    const publicDir = path.resolve(import.meta.dirname, 'public'); 
    const distPublicDir = path.resolve(import.meta.dirname, 'dist', 'public');
    
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      files.forEach(file => {
        const src = path.join(publicDir, file);
        const dest = path.join(distPublicDir, file);
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          fs.cpSync(src, dest, { recursive: true, force: true });
        } else {
          fs.copyFileSync(src, dest);
        }
      });
    }
  }
};

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), copyPublicPlugin];

export default defineConfig({
  plugins,
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  root: import.meta.dirname, // Теперь корень — это текущая папка client
  publicDir: path.resolve(import.meta.dirname, 'public'),
  build: { 
    outDir: path.resolve(import.meta.dirname, "dist/public"), 
    emptyOutDir: true 
  },
  server: {
    allowedHosts: true
  }
});
