import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url)
      )
    }
  },

  build: {
    rollupOptions: {
      output: {
        // Vite 8 使用函式判斷模組是否要放入指定的 chunk。
        manualChunks(id) {
          // 將使用者相關頁面集中到 group-user chunk。
          if (
            id.includes('/src/views/UserDetails.vue') ||
            id.includes('/src/views/UserDashboard.vue') ||
            id.includes('/src/views/UserProfileEdit.vue')
          ) {
            return 'group-user'
          }
        }
      }
    }
  }
})
