/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";
import { sky, zinc } from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Set font family
      fontFamily: {
        sans: ["Inter", ..._fontFamily.sans],
      },
      // Set theme colors (Required config!)
      colors: {
        primary: sky,
        secondary: zinc,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
  safelist: [
    {
      pattern: /pl-(2|6|10|14|18)/, // Need for runtime padding on tree menu items
    },
  ],
};
