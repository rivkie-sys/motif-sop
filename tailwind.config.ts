import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        motif: {
          red: "#683538",
          pink: "#f3af9b",
          blue: "#07477b",
          green: "#394636",
          burgundy: "#e6896e",
          yellow: "#d4c757",
          lightblue: "#89c4eb",
          gold: "#c6ae94",
          warmgold: "#e6d8a1",
          cream: "#faf9f5",
          warmgray: "#f2f1ef",
          charcoal: "#222222",
          darkgray: "#333333",
          medgray: "#dddede",
          footer: "#1f1e1d",
        },
      },
      fontFamily: {
        basis: ['"Basis Grotesque Pro"', "sans-serif"],
        cambon: ["Cambon", "serif"],
        commuters: ['"Commuters Sans"', "sans-serif"],
      },
      borderRadius: {
        pill: "30px",
        "pill-lg": "50px",
      },
    },
  },
  plugins: [],
};
export default config;
