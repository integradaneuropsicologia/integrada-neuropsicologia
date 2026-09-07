import { spawn } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import {
  STATIC_HTML_PAGE_PATHS,
  STATIC_HTML_VERSION,
  staticHtmlAssetPath,
} from "../lib/static-html.ts";

const projectRoot = resolve(import.meta.dirname, "..");
const publicRoot = resolve(projectRoot, "public");
const clientOutput = resolve(projectRoot, "dist", "client");
const generatedPublicRoot = resolve(
  publicRoot,
  "integrada-static-html-cache",
  STATIC_HTML_VERSION,
);
const vinextCli = resolve(projectRoot, "node_modules", "vinext", "dist", "cli.js");

function assertInside(basePath, targetPath) {
  const relativePath = relative(basePath, targetPath);
  if (!relativePath || relativePath.startsWith("..")) {
    throw new Error(`Unsafe generated path: ${targetPath}`);
  }
}

async function runVinextBuild() {
  await new Promise((resolveBuild, rejectBuild) => {
    const child = spawn(process.execPath, [vinextCli, "build"], {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
    });
    child.on("error", rejectBuild);
    child.on("exit", (code, signal) => {
      if (code === 0) return resolveBuild();
      rejectBuild(new Error(`vinext build failed (${signal ?? code})`));
    });
  });
}

async function renderStaticDocuments() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("prerender", Date.now().toString());
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const context = { waitUntil() {}, passThroughOnException() {} };

  for (const pathname of STATIC_HTML_PAGE_PATHS) {
    const response = await worker.fetch(
      new Request(`https://integradaneuropsicologia.com.br${pathname}`, {
        headers: { accept: "text/html" },
      }),
      env,
      context,
    );

    const contentType = response.headers.get("content-type") ?? "";
    if (response.status !== 200 || !contentType.includes("text/html")) {
      throw new Error(`Could not pre-render ${pathname}: ${response.status} ${contentType}`);
    }

    const assetPath = staticHtmlAssetPath(pathname);
    if (!assetPath) throw new Error(`No static HTML asset mapping for ${pathname}`);

    const outputPath = resolve(publicRoot, assetPath.slice(1));
    assertInside(publicRoot, outputPath);
    const html = await response.text();
    if (!html.startsWith("<!DOCTYPE html>") && !html.startsWith("<!doctype html>")) {
      throw new Error(`Invalid static HTML document for ${pathname}`);
    }

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, "utf8");
  }
}

async function validateCopiedDocuments() {
  for (const pathname of STATIC_HTML_PAGE_PATHS) {
    const assetPath = staticHtmlAssetPath(pathname);
    if (!assetPath) throw new Error(`No static HTML asset mapping for ${pathname}`);
    const outputPath = resolve(clientOutput, assetPath.slice(1));
    assertInside(clientOutput, outputPath);
    const html = await readFile(outputPath, "utf8");

    if (!html.includes("Integrada Neuropsicologia")) {
      throw new Error(`Incomplete copied HTML document for ${pathname}`);
    }
    if (/(?:gclid|gbraid|wbraid|utm_source)=/i.test(html)) {
      throw new Error(`Campaign identifier leaked into static HTML for ${pathname}`);
    }

    const assetReferences = [...html.matchAll(/(?:href|src)="(\/assets\/[^"?#]+)["?#]/g)]
      .map((match) => match[1]);
    for (const reference of new Set(assetReferences)) {
      await access(resolve(clientOutput, reference.slice(1)));
    }
  }
}

assertInside(publicRoot, generatedPublicRoot);
try {
  await rm(generatedPublicRoot, { recursive: true, force: true });
  await runVinextBuild();
  await renderStaticDocuments();
  await runVinextBuild();
  await validateCopiedDocuments();
} finally {
  await rm(generatedPublicRoot, { recursive: true, force: true });
}
