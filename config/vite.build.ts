import type { BuildOptions } from 'vite'
import { projectName } from './vite.var'

export const build: BuildOptions = {
  outDir: projectName,
  emptyOutDir: true, // 构建时清空outDir目录
  rollupOptions: {
    output: {
      entryFileNames: 'js/[name]-[hash].js', // 入口文件
      chunkFileNames: 'js/[name]-[hash].js', // 分包引入文件
      assetFileNames(assetInfo) { // 其他分类
        if (assetInfo.name?.endsWith('.css')) {
          return 'css/[name]-[hash].[ext]'
        }
        const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico']
        if (imgExts.some(ext => imgExts.includes(ext))) {
          return 'img/[name]-[hash].[ext]'
        }
        return 'assets/[name]-[hash].[ext]'
      }
    }
  }
}
