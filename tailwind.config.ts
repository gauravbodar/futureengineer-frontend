import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a1a2e',
        teal: {
          DEFAULT: '#0f6e56',
          light: '#1d9e75',
        },
        amber: {
          DEFAULT: '#ba7517',
          light: '#ef9f27',
        },
        'off-white': '#f8f8f5',
        'gray-100': '#f1f1ee',
        'gray-400': '#888780',
        'gray-900': '#1a1a18',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
