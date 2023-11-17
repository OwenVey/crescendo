/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  printWidth: 120,
};

export default config;
