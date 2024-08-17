/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
/**
 *  基础路径
 */
  readonly VITE_APP_BASE_URL: string

  /**
   *  项目名
   */
  readonly VITE_APP_TITLE: string

  readonly VITE_APP: string

  /**
   *  vite版本
   */
  readonly VITE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
