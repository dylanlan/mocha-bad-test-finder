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
    'chai-friendly/no-unused-expressions': 2,
    'max-len': [2, 120],
    'unicorn/prevent-abbreviations': 0,
    'no-console': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'import/prefer-default-export': 0,
  },
};
