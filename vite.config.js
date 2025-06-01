import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

import gitDescribe from 'git-describe'
const { gitDescribeSync } = gitDescribe

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), cloudflare()],
  define: {
    GIT_HASH: JSON.stringify(gitDescribeSync().hash),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
