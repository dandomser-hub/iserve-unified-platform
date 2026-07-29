/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          DEFAULT: '#0B5D3B',
          dark: '#064E3B',
          light: '#166534',
        },
        grass: {
          DEFAULT: '#16A34A',
          light: '#22C55E',
          lighter: '#DCFCE7',
        },
        mountain: {
          DEFAULT: '#2F855A',
          light: '#38A169',
        },
        ocean: {
          DEFAULT: '#0E7490',
          light: '#06B6D4',
          lighter: '#CCFBF1',
        },
        sky: {
          DEFAULT: '#0284C7',
          light: '#38BDF8',
          lighter: '#E0F2FE',
        },
        amber: {
          warning: '#F59E0B',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        neutral: {
          text: '#0F172A',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0B5D3B 0%, #0E7490 100%)',
        'card-gradient': 'linear-gradient(135deg, #DCFCE7 0%, #E0F2FE 100%)',
      },
    },
  },
  plugins: [],
};
