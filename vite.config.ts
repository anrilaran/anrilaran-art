import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import fs from "fs";
import { fileURLToPath } from "url";

// Железобетонное определение папки client на диске Cloudflare
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyPublicPlugin = {
  name: 'copy-public',
  apply: 'build',
  enforce: 'post',
  writeBundle() {
    const publicDir = path.resolve(__dirname, 'public');
    const distPublicDir = path.resolve(__dirname, 'dist', 'public');
    
    if (fs.existsSync(publicDir)) {
      if (!fs.existsSync(distPublicDir)) fs.mkdirSync(distPublicDir, { recursive: true });
      const files = fs.readdirSync(publicDir);
      files.forEach(file => {
        const src = path.join(publicDir, file);
        const dest = path.join(distPublicDir, file);
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
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
  resolve: { 
    alias: { "@": path.resolve(__dirname, "src") } 
  },
  // Точка отсчета для Vite — строго папка client, где лежит этот конфиг
  root: __dirname,
  publicDir: path.resolve(__dirname, 'public'),
  build: { 
    // Сборка пойдет строго в client/dist/public, как и ждет Cloudflare
    outDir: path.resolve(__dirname, "dist/public"), 
    emptyOutDir: true 
  },
  server: {
    allowedHosts: true
  }
});
