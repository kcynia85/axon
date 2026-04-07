import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    alias: {
        "@/components": path.resolve(__dirname, "./src/shared/ui"),
        "@/lib": path.resolve(__dirname, "./src/shared/lib"),
        "@/shared": path.resolve(__dirname, "./src/shared"),
        "@": path.resolve(__dirname, "./src"),
    },
  },
})
