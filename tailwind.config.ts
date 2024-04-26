import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
    colors: {
      primary: "#3674fc",
      secondary: "#eef0f3",
      grey: {
        10: "#e5e5e5",
        20: "#343536",
      },
    },
  },
  plugins: [],
};
export default config;
