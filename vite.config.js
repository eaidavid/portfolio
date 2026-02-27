import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        dev: resolve(__dirname, "dev.html"),
        design: resolve(__dirname, "design.html")
      }
    }
  }
});
