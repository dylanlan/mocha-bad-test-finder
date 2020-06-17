module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:chai-friendly/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'promise',
    'unicorn',
    'chai-friendly',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  },
};
