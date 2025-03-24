import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
      extensions: [".js", ".jsx"],
      include: ["src/**/*"], // Ensure Babel only processes src files
    }),
  ],
  resolve: {
    alias: {
      "@": "/src", // Enables imports like '@/components'
    },
  },
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [], // Ensure all required files are included
    },
  },
});
