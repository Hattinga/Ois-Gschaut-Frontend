/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
                secondary: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
