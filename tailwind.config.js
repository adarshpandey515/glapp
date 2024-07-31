// import { colors } from "./src/styles/colors"
// import { fontFamily } from "./src/styles/fontFamily"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cpurple: '#000000',
        yellow:"#e89a0a",
      },
  
    },
  },
  plugins: [],
}
