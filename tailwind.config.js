/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2CE8E5",
          "primary-2": "#16C3C0",
          "primary-3": "#129F9D",
          "primary-4": "#0E7C7A",
          "primary-5": "#0A5957",
          "primary-6": "#063534",
          "primary-7": "#021211",

          "primary-focus": "#1EB4B1",

          "primary-content": "#021212",

          secondary: "#2C6EE8",

          "secondary-focus": "#1B438B",

          "secondary-content": "#FFFFFF",

          accent: "#872CE8",

          "accent-focus": "#50198A",

          "accent-content": "#FFFFFF",

          neutral: "#191D24",

          info: "#3ABFF8",

          success: "#36D399",

          warning: "#FBBD23",

          error: "#F87272",

          "base-100": "#2A303C",

          "base-200": "#121A2B",

          "base-300": "#0B1529",
        },
      },
    ],
  },
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
