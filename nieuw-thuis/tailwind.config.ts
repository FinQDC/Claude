import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#B9603F',
          deep: '#9B4E32',
          soft: '#D4886A',
          bg: '#F4E5DD',
        },
        night: {
          DEFAULT: '#1F3548',
          soft: '#3A5266',
        },
        cream: {
          DEFAULT: '#F5EEE3',
          deep: '#EBE2D2',
          warm: '#FBF7EE',
        },
        salie: {
          DEFAULT: '#7A8B6F',
          soft: '#A3B19A',
          bg: '#E8EBE3',
        },
        oker: {
          DEFAULT: '#D4A05A',
          soft: '#E5C28B',
          bg: '#F5E8CF',
        },
        ink: {
          DEFAULT: '#1F3548',
          soft: '#5A6877',
          muted: '#8A95A1',
        },
        line: {
          DEFAULT: 'rgba(31, 53, 72, 0.12)',
          soft: 'rgba(31, 53, 72, 0.06)',
        },
        'green-ok': '#5C8B5C',
        'green-bg': '#E5EFE5',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm-soft': '0 1px 3px rgba(31, 53, 72, 0.06)',
        'md-soft': '0 4px 16px rgba(31, 53, 72, 0.08)',
        'lg-soft': '0 12px 32px rgba(31, 53, 72, 0.12)',
      },
      maxWidth: {
        wrap: '1240px',
      },
    },
  },
  plugins: [],
}

export default config
