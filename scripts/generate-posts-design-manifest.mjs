import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const postsDir = path.join(rootDir, "public", "posts-design");
const manifestPath = path.join(postsDir, "manifest.json");

const supportedExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"]);

await fs.mkdir(postsDir, { recursive: true });

let entries = [];
try {
  entries = await fs.readdir(postsDir, { withFileTypes: true });
} catch {
  entries = [];
}

const filesWithMeta = [];

for (const entry of entries) {
  if (!entry.isFile()) continue;
  const name = entry.name;
  if (!name || name.startsWith(".")) continue;
  if (name.toLowerCase() === "manifest.json") continue;

  const ext = path.extname(name).toLowerCase();
  if (!supportedExts.has(ext)) continue;

  try {
    const stat = await fs.stat(path.join(postsDir, name));
    filesWithMeta.push({ name, mtimeMs: stat.mtimeMs ?? 0 });
  } catch {
    filesWithMeta.push({ name, mtimeMs: 0 });
  }
}

filesWithMeta.sort((a, b) => {
  const timeDelta = (b.mtimeMs || 0) - (a.mtimeMs || 0);
  if (timeDelta) return timeDelta;
  return a.name.localeCompare(b.name);
});

const manifest = {
  files: filesWithMeta.map((item) => item.name)
};

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`[posts-design] ${manifest.files.length} image(s) -> public/posts-design/manifest.json`);

