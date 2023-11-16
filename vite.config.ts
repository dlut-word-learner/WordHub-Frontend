/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server' 
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
    mockDevServerPlugin({
      // exclude: ["mock/**"],
    }),
    visualizer({
      filename: "stats.html",
    })
  ],
  server: {
    proxy: {
      '^/api/*': {
        target: 'http://127.0.0.1:25564/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/dictYoudao': {
        target: 'https://dict.youdao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dictYoudao/, ''),
      }
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    server:{
        deps: {
          inline: ['element-plus']
        }
      }
    },
})
