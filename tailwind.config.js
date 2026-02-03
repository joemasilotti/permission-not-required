/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./_includes/**/*.{html,liquid}",
    "./_layouts/**/*.{html,liquid}",
    "./*.{html,liquid}",
  ],
  theme: {
    extend: {
      spacing: {
        112: "28rem",
        120: "30rem",
      },
      colors: {
        accent: {
          400: "#4B5587",
          500: "#3A4270",
          600: "#2C346B",
          700: "#232A56",
          900: "#161B38",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
