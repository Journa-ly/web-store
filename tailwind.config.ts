import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ['var(--font-geist-sans)']
  //     },
  //     keyframes: {
  //       fadeIn: {
  //         from: { opacity: '0' },
  //         to: { opacity: '1' }
  //       },
  //       marquee: {
  //         '0%': { transform: 'translateX(0%)' },
  //         '100%': { transform: 'translateX(-100%)' }
  //       },
  //       blink: {
  //         '0%': { opacity: '0.2' },
  //         '20%': { opacity: '1' },
  //         '100%': { opacity: '0.2' }
  //       }
  //     },
  //     animation: {
  //       fadeIn: 'fadeIn .3s ease-in-out',
  //       carousel: 'marquee 60s linear infinite',
  //       blink: 'blink 1.4s both infinite'
  //     }
  //   }
  // },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require("daisyui"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    })
  ],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: ["CMYK"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};

export default config;
