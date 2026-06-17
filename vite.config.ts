import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import fs from "fs";

const copyPublicPlugin = {
  name: 'copy-public',
  apply: 'build',
  enforce: 'post',
  writeBundle() {
    // Теперь пути указывают строго ВНУТРИ папки client
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
  // Теперь пути к src и alias идут относительно корня (client)
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  root: import.meta.dirname, 
  publicDir: path.resolve(import.meta.dirname, 'public'),
  // Билд теперь идет в client/dist/public, что полностью устраивает Cloudflare
  build: { 
    outDir: path.resolve(import.meta.dirname, "dist/public"), 
    emptyOutDir: true 
  },
  server: {
    allowedHosts: true
  }
});
