import { resolve } from "node:path";
import { cpSync, existsSync } from "node:fs";
import { defineConfig } from "vite";

function copyStaticDirsPlugin() {
  const staticDirs = ["js", "css", "assets"];

  return {
    name: "copy-static-dirs",
    writeBundle() {
      staticDirs.forEach((dir) => {
        const from = resolve(__dirname, dir);
        if (!existsSync(from)) return;
        const to = resolve(__dirname, "dist", dir);
        cpSync(from, to, { recursive: true, force: true });
      });
    }
  };
}

export default defineConfig({
  plugins: [copyStaticDirsPlugin()],
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
