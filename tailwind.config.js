/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";
import { blue, slate } from "tailwindcss/colors";
export const content = [
  "./node_modules/flowbite-react/**/*.js",
  "./app/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./helpers/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
  extend: {
    // Set font family
    fontFamily: {
      sans: ["Inter", ..._fontFamily.sans],
    },
    // Set theme colors (Required config!)
    colors: {
      primary: blue,
      secondary: slate,
    },
  },
};
export const plugins = [
  require('@tailwindcss/typography'),
  require("flowbite/plugin")
];
