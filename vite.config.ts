import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Tailwind v4: no tailwind.config.ts — tokens live in an @theme block in
// src/styles/index.css, loaded via this Vite plugin (build-plan.md decision).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  // lucide-react ships one ES module per icon (~1,500 of them) — without this,
  // Vite's dependency pre-bundler discovers and re-bundles them lazily on first
  // use, which shows up as a slow, janky first paint on every cold dev start.
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL ?? 'http://api:4000',
        changeOrigin: true,
      },
    },
  },
});
