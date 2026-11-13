import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceFiles = ["src/data/profile.json", "src/data/profile.ts", "src/pages/[lang]/cv.astro"];
export const hashFile = resolve(root, "public/assets/cv/cv-source.sha256");

export async function getCvSourceHash() {
  const hash = createHash("sha256");

  for (const relativePath of sourceFiles) {
    hash.update(`${relativePath}\0`);
    hash.update(await readFile(resolve(root, relativePath)));
    hash.update("\0");
  }

  return hash.digest("hex");
}

export async function writeCvSourceHash() {
  const digest = await getCvSourceHash();
  await writeFile(hashFile, `${digest}\n`, "utf8");
  return digest;
}
