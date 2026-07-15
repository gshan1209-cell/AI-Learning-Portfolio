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
        ink: "#102033",
        paper: "#f7f5ef",
        brand: "#176b66",
        accent: "#d97745"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(25, 45, 65, 0.10)"
      }
    },
  },
  plugins: [],
};

export default config;
