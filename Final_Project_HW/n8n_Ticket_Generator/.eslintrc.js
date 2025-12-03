module.exports = {
  root: true,
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  plugins: ['n8n-nodes-base'],
  extends: ['plugin:n8n-nodes-base/nodes'],
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {},
};

