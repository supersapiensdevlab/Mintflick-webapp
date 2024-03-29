/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2C6EE8",

          secondary: "#D926A9",

          accent: "#1FB2A6",

          neutral: "#191D24",

          "base-100": "#ffffff",

          info: "#3ABFF8",

          success: "#36D399",

          warning: "#FBBD23",

          error: "#F87272",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        Gilroy: ["Gilroy"],
      },
      boxShadow: {
        mintflick: "0px 12px 12px rgba(0, 0, 0, 0.02)",
      },

      colors: {
        alt: "#161616",
        "brand-100": "#a0f5f3",
        "brand-200": "#8df3f1",
        "brand-300": "#76f0ee",
        super_silver: "#B8B8B8",
        super_gold: "#E1B136",
        super_platinum: "#ED4B9E",
        brand: "#2ce8e5",
        mintie: "#282052",
        "brand-500": "#25c5c3",
        "brand-600": "#20a9a7",
        "brand-700": "#0f5150",
        "brand-800": "#0b3a39",
        "brand-900": "#051a19",
        "brand-secondary": "#2C6EE8",
      },
    },
  },
  plugins: [require("daisyui"), "react-optimized-image/plugin"],
};
