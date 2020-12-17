module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: [
    'prettier',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/no-unsafe-return": 0,
    "@typescript-eslint/no-unsafe-call": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0
  }
}
