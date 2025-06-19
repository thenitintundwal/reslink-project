import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {
            keyframes: {
              "spin-reverse": {
                "100%": {
                  transform: "rotate(-360deg)",
                },
              },
            },
            animation: {
              "border-spin": "spin-reverse 7s linear infinite",
            },
          },
        },
      },
    }),
    glsl(),
  ],
});
