import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#c41e3a",
        "primary-dark": "#9b1830",
        "background-dark": "#080808",
        surface: "#0f0f0f",
        "surface-light": "#161616",
        "gold-accent": "#b8860b",
        "gold-light": "#d4a017",
        bone: "#e8dcc8",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        heading: ["Bebas Neue", "sans-serif"],
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.3", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fadeUp 0.4s ease forwards",
        pulse: "pulse 1.2s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
