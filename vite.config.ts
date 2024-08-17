import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { plugins } from './config/vite.plugins'
import { build } from './config/vite.build'
import { projectName } from './config/vite.var'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    base: mode === 'production' ? `/${projectName}` : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@imgs': path.resolve(__dirname, 'src/assets/imgs'),
        '@styles': path.resolve(__dirname, 'src/assets/styles')
      }
    },
    build,
    plugins
  }
})
