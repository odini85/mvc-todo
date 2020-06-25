/* eslint-disable no-undef */
module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['babel', 'prettier'],
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
};
