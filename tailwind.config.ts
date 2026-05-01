import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'ds-bg': '#0a0a0f',
        'ds-surface': '#111118',
        'ds-surface-2': '#1a1a24',
        'ds-accent': '#7c5cfc',
        'ds-accent-2': '#00d4aa',
        'ds-accent-3': '#ff6b35',
      },
    },
  },
  plugins: [],
}

export default config
