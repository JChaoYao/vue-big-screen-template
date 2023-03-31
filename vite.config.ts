import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 本地IP访问，localhost访问
    port: 7778, // 端口号
    hmr: true, // 热更新
    open: false, // false关闭，true打开。启动项目后，自动在浏览器打开（浏览器已经打开的情况）
  },
  resolve: {
    alias: [
      {
        find: '@', // 配置别名，tsconfig.json里面也需要配置. @等价于src
        replacement: resolve(__dirname, 'src') 
      }
    ]
  }
})
