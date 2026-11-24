/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        khodal: {
          ivory: "#F4EFE6",
          offwhite: "#FAF8F3",
          sandstone: "#C9BBA7",
          gold: "#AD8A53",
          'gold-light': "#C8A974",
          'gold-muted': "#91703E",
          espresso: "#30241F",
          charcoal: "#252321",
          burgundy: "#713B43",
          'burgundy-deep': "#4D2128",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "Cambria", "serif"],
        display: ["var(--font-cormorant-sc)", "var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "-apple-system", "sans-serif"],
        editorial: ["var(--font-cinzel)", "var(--font-cormorant)", "serif"],
      },
      // Slightly larger small sizes for readability (defaults: xs 12px, sm 14px).
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.25rem' }],
        sm: ['0.9375rem', { lineHeight: '1.5rem' }],
      },
      letterSpacing: {
        widest: ".25em",
        ultra: ".35em",
      },
    },
  },
  plugins: [],
};
