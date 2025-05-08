/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          dark: 'hsl(240, 10%, 10%)',
        },
        foreground: {
          DEFAULT: 'hsl(240, 10%, 10%)',
          dark: 'hsl(0, 0%, 98%)',
        },
        primary: {
          DEFAULT: 'hsl(252, 80%, 60%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(240, 5%, 90%)',
          foreground: 'hsl(240, 10%, 10%)',
        },
        accent: {
          DEFAULT: 'hsl(328, 85%, 55%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(240, 5%, 96%)',
          foreground: 'hsl(240, 4%, 46%)',
          dark: 'hsl(240, 5%, 26%)',
        },
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(240, 10%, 10%)',
          dark: 'hsl(240, 10%, 15%)',
        },
        border: 'hsl(240, 5%, 84%)',
        input: 'hsl(240, 5%, 90%)',
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
