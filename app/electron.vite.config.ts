import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { builtinModules } from 'module'

// Only externalize electron + Node.js built-ins — everything else gets bundled
// so the packaged .asar is fully self-contained.
const NODE_EXTERNALS = ['electron', ...builtinModules, ...builtinModules.map(m => `node:${m}`)]

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.ts')
        },
        external: NODE_EXTERNALS,
        output: {
          entryFileNames: '[name].cjs',
          format: 'cjs'
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts')
        },
        external: NODE_EXTERNALS,
        output: {
          entryFileNames: '[name].cjs',
          format: 'cjs'
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, '.'),
    plugins: [
      react(),
      // Electron loads HTML via file:// — crossorigin blocks scripts/styles
      {
        name: 'remove-crossorigin',
        transformIndexHtml(html: string) {
          return html.replace(/\s+crossorigin/g, '')
        }
      }
    ],
    build: {
      outDir: resolve(__dirname, 'out/renderer'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
          settings: resolve(__dirname, 'settings.html')
        }
      }
    },
    css: {
      postcss: './postcss.config.js'
    }
  }
})
