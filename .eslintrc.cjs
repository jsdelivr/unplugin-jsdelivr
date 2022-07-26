require("@ayuhito/eslint-config/patch");

module.exports = {
  extends: ["@ayuhito/eslint-config/profile/node"],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    "no-console": "off",
    "import/no-default-export": "off",
    semi: ["error", "always"],
    quotes: ["error", "single", { avoidEscape: true }],
  },
};
