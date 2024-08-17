import vue from '@vitejs/plugin-vue'

// 自动导入
import autoImport from 'unplugin-auto-import/vite'
// jsx支持
import vueTsx from '@vitejs/plugin-vue-jsx'
// 删除生产时的console.log
import removeConsole from 'vite-plugin-remove-console'
// 压缩打包后的文件
import zipPack from 'vite-plugin-zip-pack'
// 自动导入.env变量
import autoImportEnv from '../plugins/auto-import-env'
import { projectName } from './vite.var'

export const plugins = [
  vue(),
  vueTsx(),
  removeConsole(),
  zipPack({
    outDir: './', // 打包到目录
    outFileName: `${projectName}.zip`, // zip名字
    inDir: projectName // 打包那个文件夹
  }),
  autoImport({
    imports: ['vue'],
    dirs: [
      './src/**'
    ],
    dts: true,
    eslintrc: {
      enabled: true
    }
  }),
  autoImportEnv()
]
