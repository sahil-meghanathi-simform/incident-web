module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2023, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: { browser: true, es2023: true, node: true },
  ignorePatterns: ['dist/', 'node_modules/', 'src/api/contracts/'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='window'][callee.property.name='localStorage']",
        message: 'Do not use localStorage for auth/session state — the access token is an in-memory module variable (api/client.ts). See build-plan.md §6.2.',
      },
    ],
  },
};
