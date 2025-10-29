module.exports = {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        "app-primary": "var(--app-primary)",
        black: "var(--black)",
        "black-1": "var(--black-1)",
        "primary-20": "var(--primary-20)",
      },
      fontFamily: {
        "body-1-regular": "var(--body-1-regular-font-family)",
        "body-1-semibold": "var(--body-1-semibold-font-family)",
        "body-2-regular": "var(--body-2-regular-font-family)",
        "body-2-semibold": "var(--body-2-semibold-font-family)",
        "h1-bold": "var(--h1-bold-font-family)",
        "h2-medium": "var(--h2-medium-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
