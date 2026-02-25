/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#E8001D',
          dark: '#B8001A',
          light: '#FFF1F2',
          50:  '#FFF1F2',
          100: '#FFE1E4',
          600: '#E8001D',
          700: '#C8001A',
          800: '#A80016',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          muted: '#3D3D3D',
          faint: '#6B7280',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F7F7F8',
          3: '#EFEFEF',
        },
        border: {
          DEFAULT: '#E5E5E5',
          strong: '#D0D0D0',
        },
        gold: '#F5C200',
        ghana: { green: '#006B3F' },
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        dropdown: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.85',
          },
        },
      },
    },
  },
  plugins: [],
}
