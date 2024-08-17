import path from 'node:path'
import fs from 'node:fs'
import type { Plugin } from 'vite'
import { ESLint } from 'eslint'

export default function autoImportEnv(options?: {
  envPath?: string
}): Plugin {
  return {
    name: 'auto-import-env',
    configResolved(config) {
      if (config.env.PRO)
        return
      // 读取.env文件
      const envPath = options?.envPath ?? path.resolve(config.root, '.env')
      if (!fs.existsSync(envPath)) {
        console.warn(`No .env file found at ${envPath}`)
        return
      }
      const envFileContent = fs.readFileSync(envPath, 'utf-8')
      // 解析每一行数据
      const envVariables = envFileContent
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.split('=')[0].trim())
      const envVariableMap: {
        annotation?: string
        variable: string
      } [] = []
      let nextIndex = 0
      while (nextIndex <= envVariables.length - 1) {
        if (!isNote(envVariables[nextIndex])) {
          envVariableMap.push({
            variable: envVariables[nextIndex]
          })
          nextIndex++
        }
        else {
          if (!isNote(envVariables[nextIndex + 1])) {
            envVariableMap.push({
              annotation: envVariables[nextIndex].replace('#', ''),
              variable: envVariables[nextIndex + 1]
            })
            nextIndex += 2
          }
        }
      }
      // 生成env.d.ts文件内容
      const envDTSContent = `
/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
${envVariableMap.map((envVar, index) => {
    const last = index === envVariableMap.length - 1
    if (envVar.annotation) {
      return `/**\n   * ${envVar.annotation}\n   */\n  readonly ${envVar.variable}: string${!last ? '\n' : ''}`
    }
    else {
      return `  readonly ${envVar.variable}: string${!last ? '\n' : ''}`
    }
  }).join('\n')
}
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`

      // 写入env.d.ts文件
      const outputPath = path.resolve(config.root, 'env.d.ts')
      if (fs.existsSync(outputPath)) {
        writeFile(outputPath, envDTSContent.trim())
      }
      else {
        fs.writeFile(outputPath, '', (err: any) => {
          if (!err) {
            writeFile(outputPath, envDTSContent.trim())
          }
        })
      }
    }
  }
}

// 写入解析好的数据
function writeFile(outPath: string, content: string) {
  fs.writeFileSync(outPath, content)
  formatter([path.join(__dirname, '../env.d.ts')])
}

// 是否是注释
function isNote(variable: string) {
  return variable?.startsWith('#')
}

// 格式化.env.d.ts
async function formatter(filePaths: string[]) {
  const eslint = new ESLint({
    fix: true
  })
  const results = await eslint.lintFiles(filePaths)
  await ESLint.outputFixes(results)

  return results
}
