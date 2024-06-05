import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lightPaper: '#FCF6F5',
        darkPaper: '#272C30',
        light: {
          colors: {
            background: '#ddd4d3',
            foreground: '#212529',
          },
        },
        dark: {
          colors: {
            background: '#212529',
            foreground: '#FCF6F5',
          },
        },
      },
      fontFamily: {
        'fabrikat': ['var(--font-fabrikat)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    nextui({
      themes: {
        light: {
          colors: {
            background: '#ddd4d3',
            foreground: '#212529',
            primary: {
              50: '#fff0f0',
              100: '#ffcbce',
              200: '#ffa0a6',
              300: '#ff6b78',
              400: '#fc374d',
              500: '#eb1f3f',
              600: '#c50b2c',
              700: '#a50c2c',
              800: '#8d0e2d',
              900: '#4f0213',
              DEFAULT: '#eb1f3f',
              foreground: '#212529',
            }
          },
        },
        dark: {
          colors: {
            background: '#212529',
            foreground: '#FCF6F5',
            primary: {
              50: '#fff0f0',
              100: '#ffcbce',
              200: '#ffa0a6',
              300: '#ff6b78',
              400: '#fc374d',
              500: '#eb1f3f',
              600: '#c50b2c',
              700: '#a50c2c',
              800: '#8d0e2d',
              900: '#4f0213',
              DEFAULT: '#eb1f3f',
              foreground: '#FCF6F5',
            }
          },
        },
      },
    }),
  ],
  darkMode: 'class',
};
export default config;
