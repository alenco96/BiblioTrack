import { build, context } from "esbuild";
import { mkdirSync, copyFileSync } from "node:fs";

const opts = {
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["safari15"],
  jsx: "transform",
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "dist/app.js",
  logLevel: "info",
};

mkdirSync("dist", { recursive: true });
copyFileSync("index.html", "dist/index.html");

if (process.argv.includes("--watch")) {
  const ctx = await context(opts);
  await ctx.watch();
} else {
  await build(opts);
}
