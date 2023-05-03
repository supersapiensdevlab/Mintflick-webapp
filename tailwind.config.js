/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Gilroy: ["Gilroy"],
      },
      colors: {
        "vapormintMint-500": "#009C98",
        "vapormintMint-400": "#00B3AE",
        "vapormintMint-300": "#07EFEA",
        "vapormintMint-200": "#2BFFFA",
        "vapormintMint-100": "#6BFFFC",
        "vapormintMint-75": "#96FFFD",
        "vapormintMint-50": "#E6FFFE",

        "vapormintBlue-500": "#2D009C",
        "vapormintBlue-400": "#3300B3",
        "vapormintBlue-300": "#4900FF",
        "vapormintBlue-200": "#682BFF",
        "vapormintBlue-100": "#956BFF",
        "vapormintBlue-75": "#B496FF",
        "vapormintBlue-50": "#EDE6FF",

        "vapormintLuxury-500": "#5C009C",
        "vapormintLuxury-400": "#6900B3",
        "vapormintLuxury-300": "#9600FF",
        "vapormintLuxury-200": "#A82BFF",
        "vapormintLuxury-100": "#C26BFF",
        "vapormintLuxury-75": "#D496FF",
        "vapormintLuxury-50": "#F5E6FF",

        "vapormintPink-500": "#9C0076",
        "vapormintPink-400": "#B30087",
        "vapormintPink-300": "#FF00C1",
        "vapormintPink-200": "#FF2BCC",
        "vapormintPink-100": "#FF6BDB",
        "vapormintPink-75": "#FF96E6",
        "vapormintPink-50": "#FFE6F9",

        "vapormintError-500": "#EE4D37",
        "vapormintError-400": "#F16B59",
        "vapormintError-300": "#F5988B",
        "vapormintError-200": "#F8B6AD",
        "vapormintError-100": "#FDEDEB",

        "vapormintWarning-500": "#F08D32",
        "vapormintWarning-400": "#F3A055",
        "vapormintWarning-300": "#F6BD88",
        "vapormintWarning-200": "#F9D0AB",
        "vapormintWarning-100": "#FEF4EB",

        "vapormintSuccess-500": "#06C270",
        "vapormintSuccess-400": "#30CC88",
        "vapormintSuccess-300": "#6FDCAC",
        "vapormintSuccess-200": "#99E6C4",
        "vapormintSuccess-100": "#E6F9F1",

        "vapormintBlack-300": "#000000",
        "vapormintBlack-200": "#434343",
        "vapormintBlack-100": "#7B7B7B",

        "vapormintWhite-300": "#A3A3A3",
        "vapormintWhite-200": "#C7C6C6",
        "vapormintWhite-100": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
