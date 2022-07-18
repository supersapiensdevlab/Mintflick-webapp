/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        alt: "#161616",
        "brand-100": "#a0f5f3",
        "brand-200": "#8df3f1",
        "brand-300": "#76f0ee",
        brand: "#2ce8e5",
        "brand-500": "#25c5c3",
        "brand-600": "#20a9a7",
        "brand-700": "#0f5150",
        "brand-800": "#0b3a39",
        "brand-900": "#051a19",
      },
    },
  },
  plugins: [require("daisyui")],
};
