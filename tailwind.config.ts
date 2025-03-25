import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  // daisyUI config
  daisyui: {
    themes: [
      {
        journaTheme: {
          primary: '#00d7c0',
          'primary-content': '#ffffff',
          secondary: '#ff00d3',
          accent: '#4a00ff',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          'base-200': '#f2f2f2',
          'base-300': '#e5e7eb',
          'base-400': '#d1d5db',
          'base-500': '#9ca3af',
          'base-600': '#6b7280',
          'base-700': '#374151',
          'base-800': '#1f2937',
          'base-900': '#111827'
        }
      }
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root' // The element that receives theme color CSS variables
  }
};

export default config;
