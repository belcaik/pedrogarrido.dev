import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright-core";
import { writeCvSourceHash } from "./cv-hash.mjs";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const outputDirectory = resolve(root, "public/assets/cv");
const chromePath = process.env.CHROME_PATH || "/usr/bin/google-chrome-stable";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

function run(command, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${signal || code}`));
    });
  });
}

function startServer() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      let filePath = resolve(dist, `.${pathname}`);
      if (filePath !== dist && !filePath.startsWith(`${dist}${sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }

      if ((await stat(filePath)).isDirectory()) filePath = resolve(filePath, "index.html");
      response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });

  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolveServer(server));
  });
}

await run("pnpm", ["astro", "build"]);
await mkdir(outputDirectory, { recursive: true });

const server = await startServer();
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const temporaryFiles = [
  resolve(outputDirectory, ".public_cv.pdf.tmp"),
  resolve(outputDirectory, ".public_cv_es.pdf.tmp"),
];
let browser;

try {
  browser = await chromium.launch({ executablePath: chromePath, headless: true });

  for (const [index, lang] of ["en", "es"].entries()) {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/${lang}/cv/`, { waitUntil: "networkidle" });
    await page.pdf({
      path: temporaryFiles[index],
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    await page.close();
  }

  await rename(temporaryFiles[0], resolve(outputDirectory, "public_cv.pdf"));
  await rename(temporaryFiles[1], resolve(outputDirectory, "public_cv_es.pdf"));
  const digest = await writeCvSourceHash();
  console.log(`Generated English and Spanish CVs (source ${digest}).`);
} finally {
  await browser?.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await Promise.all(temporaryFiles.map((file) => rm(file, { force: true })));
}
