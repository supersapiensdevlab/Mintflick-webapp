module.exports = {
  eslint: {
    configure: {
      rules: {
        'no-unused-vars': 'off',
      },
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
