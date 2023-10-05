/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],

  //semi: false,
  printWidth: 1000,
  singleQuote: true,
  trailingComma: 'none',
  singleAttributePerLine: false,
  options: {
    editorconfig: true
  }
};
