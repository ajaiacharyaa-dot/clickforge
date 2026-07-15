import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        accent: '#F7B801',
      },
      backgroundImage: {
        'gradient-viral': 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)',
      },
    },
  },
  plugins: [],
}
export default config
