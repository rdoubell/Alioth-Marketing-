// Ambient declaration for importing the root-level tailwind.config.js from
// tests. The config file lives outside tsconfig.app.json's `src` include
// scope (and isn't type-checked itself), so this gives the import a concrete
// shape instead of tsc reporting TS7016 ("could not find a declaration
// file") for a plain, un-typed .js module.
declare module '*/tailwind.config.js' {
  interface TailwindConfig {
    theme: {
      extend: {
        colors: Record<string, string>
        fontFamily: Record<string, string[]>
      }
    }
  }

  const config: TailwindConfig
  export default config
}
