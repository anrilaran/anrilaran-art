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
    // Никаких динамических путей, только относительные от корня папки client
    const publicDir = path.resolve("public");
    const distPublicDir = path.resolve("dist/public");
    
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
    alias: { "@": path.resolve("src") } 
  },
  root: "./",
  publicDir: "public",
  build: { 
    outDir: "dist/public", 
    emptyOutDir: true 
  },
  server: {
    allowedHosts: true
  }
});
