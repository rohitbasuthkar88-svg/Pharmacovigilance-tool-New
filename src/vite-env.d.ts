// The default Vite client types could not be found, so we are defining the
// necessary types for `import.meta.env` manually. This resolves the type
// errors related to accessing environment variables in the application.

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
