/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BACKEND_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
