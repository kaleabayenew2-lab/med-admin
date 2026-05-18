/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_API_WITH_CREDENTIALS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}