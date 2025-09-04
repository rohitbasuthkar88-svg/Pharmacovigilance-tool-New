// The default Vite client types could not be found, so we are defining the
// necessary types for `import.meta.env` manually. This resolves the type
// errors related to accessing environment variables in the application.

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// FIX: Augment the NodeJS.ProcessEnv interface to avoid redeclaring the global 'process' variable.
// This resolves the "Subsequent variable declarations must have the same type" and
// "Cannot redeclare block-scoped variable" errors by correctly extending the existing
// types for process.env, as expected in an environment with @types/node.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
