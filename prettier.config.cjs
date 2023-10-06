/** @type {import("prettier").Config} */
module.exports = {
  //plugins: [require.resolve('prettier-plugin-tailwindcss')], // TODO: Is messing with Prettier

  //semi: false,
  printWidth: 1000,
  singleQuote: true,
  trailingComma: 'none',
  singleAttributePerLine: false,
  options: {
    editorconfig: true
  }
};
