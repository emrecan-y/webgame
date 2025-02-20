/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BACKEND_DOMAIN: string;
  VITE_BACKEND_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
