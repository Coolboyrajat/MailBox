/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{tsx,ts,jsx,js}"
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3498db',
          secondary: '#2ecc71',
          background: '#f5f8fa',
          container: '#ffffff',
          border: '#e1e8ed',
          text: '#333333',
          'text-light': '#657786',
          'button-hover': '#f0f3f5',
        },
        borderRadius: {
          DEFAULT: '12px',
          button: '8px',
        },
        boxShadow: {
          DEFAULT: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }
      },
    },
    plugins: [],
  }
  