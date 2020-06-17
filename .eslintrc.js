module.exports = {
  extends: ['airbnb-typescript/base'],
  plugins: [
    '@typescript-eslint',
    'promise',
    'unicorn',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/indent': 'off',
  },
};
