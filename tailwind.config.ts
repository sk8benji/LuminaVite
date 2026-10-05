import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ["'Great Vibes'", "'Alex Brush'", "'Pinyon Script'", "cursive"],
        pinyon: ["'Pinyon Script'", "cursive"],
        cinzel: ["'Cinzel'", "serif"],
        playfair: ["'Playfair Display'", "serif"],
        cormorant: ["'Cormorant Garamond'", "serif"],
        prata: ["'Prata'", "serif"],
        sans: ["'Montserrat'", "'Inter'", "sans-serif"],
      },
      colors: {
        gold: {
          50: "#FAF7EE",
          100: "#F5EDDC",
          200: "#EBDAA9",
          300: "#E1C877",
          400: "#D7B544",
          500: "#BFA15F",
          600: "#997F44",
        },
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
