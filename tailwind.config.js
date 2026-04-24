/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lb: {
          bg:      '#14181c',
          surface: '#1f2a38',
          card:    '#2c3440',
          border:  '#45515e',
          muted:   '#8ba3b0',
          text:    '#ccd5da',
          accent:  '#40bcf4',
          green:   '#00e054',
          orange:  '#ff8000',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')], // eslint-disable-line no-undef
}
