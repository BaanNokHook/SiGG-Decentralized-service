module.exports = {
  root: true,
  extends: [
    "airbnb-typescript/base",
    "plugin:jest/all",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  env: {
    browser: true,
    jquery: true,
  },
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
};
