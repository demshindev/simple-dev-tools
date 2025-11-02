import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import { generateSEOFilesPlugin } from './scripts/generate-seo-files'
import { APP_NAME, AUTHOR_NAME } from './src/constants'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const domain = env.VITE_APP_DOMAIN
  
  if (!domain) {
    throw new Error('VITE_APP_DOMAIN is required in .env file')
  }
  
  return {
  base: '/',
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            APP_DOMAIN: `https://${domain}`,
            APP_NAME,
            AUTHOR_NAME
          }
        }
      }),
      generateSEOFilesPlugin({
        domain
      })
    ],
  build: {
      outDir: 'dist',
    rollupOptions: {
      output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor'
            }
            if (id.includes('node_modules/react-icons')) {
              return 'icons'
            }
            if (id.includes('node_modules')) {
              return 'vendor-other'
            }
        }
      }
    },
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        format: {
          comments: false
      }
      } : undefined
    }
  }
})

