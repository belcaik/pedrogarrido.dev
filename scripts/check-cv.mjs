import { readFile } from "node:fs/promises";
import { getCvSourceHash, hashFile } from "./cv-hash.mjs";

const expected = await getCvSourceHash();
let actual = "";

try {
  actual = (await readFile(hashFile, "utf8")).trim();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (actual !== expected) {
  console.error("CV source changed but the downloadable PDFs are stale. Run `pnpm cv` and commit the regenerated files.");
  process.exit(1);
}

console.log("CV source hash matches the generated PDFs.");
