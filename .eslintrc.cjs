module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    // TypeScript already checks for undefined variables; no-undef produces
    // false positives against TS-only globals and types.
    'no-undef': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}
