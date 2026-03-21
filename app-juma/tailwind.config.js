/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
        colors: {
            "primary": "#C5A37F",
            "secondary": "#F3EDE2",
            "tertiary": "#97ABC1",
            "background": "#FCFAFA",
            "neutral": "#FCFAFA",
            "carbon": "#1F1A17",
            "ink": "#5A4A3F",
            "muted": "#8C837B",
            "line": "#E6DED4",
        },
        fontFamily: {
            "sans": ["Inter", "sans-serif"],
            "serif": ["Playfair Display", "serif"]
        },
        borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
  ],
}

