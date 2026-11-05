/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

declare module "*?url" {
  const result: string;
  export default result;
}
