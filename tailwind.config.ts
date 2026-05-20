import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        gold: '#B8952A',
        'gold-light': '#D4AF50',
        'gold-pale': '#FDF6E3',
        dark: '#1a1a1a',
        muted: '#888888',
        border: '#e8e0d0',
        cream: '#FAFAF7',
        cream2: '#F5F0E8',
      },
    },
  },
  plugins: [],
}
export default config