/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: {
          light: "#F7F8FA",
          dark: "#0F1115",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#171A21",
        },
        border: {
          light: "#E4E7EC",
          dark: "#2A2E37",
        },
        ink: {
          light: "#1A1D23",
          dark: "#E6E8EC",
        },
        muted: {
          light: "#6B7280",
          dark: "#9096A2",
        },
        primary: {
          DEFAULT: "#5B47E0",
          hover: "#4C3AC7",
          light: "#EDE9FE",
        },
        accent: {
          DEFAULT: "#FF6B4A",
          hover: "#F0552F",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
