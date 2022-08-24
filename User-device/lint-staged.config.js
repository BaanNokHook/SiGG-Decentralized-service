module.exports = {
  "*.{js,jsx}": ["eslint --fix"],
  "*.css": ["stylelint --fix"],
  "*.{md,html,json,yml,yaml}": ["prettier --write"],
};
