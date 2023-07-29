/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        NotoSansMaths: ['Noto Sans Maths'],
        satoshi: ['Satoshi', 'sans-serif'],
        poppins: ['poppins', 'sans-serif'],
        quicksand: ['quicksand', 'sans-serif'],
        roboto: ['roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-orange': '#FF5722',
      }
    },
  },
  plugins: [],
}
