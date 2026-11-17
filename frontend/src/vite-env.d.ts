/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPERATOR_PIN?: string;
  /** Full API base including `/api`, e.g. `https://api.example.com/api`. Leave empty for local Vite proxy. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
