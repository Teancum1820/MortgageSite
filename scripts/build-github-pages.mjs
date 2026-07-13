import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const nextCli = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(process.execPath, [nextCli, "build"], {
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
  },
  stdio: "inherit",
});

if (result.status !== 0) {
  if (result.error) {
    console.error(result.error);
  }
  process.exit(result.status ?? 1);
}

const outDir = join(process.cwd(), "out");
const indexPath = join(outDir, "index.html");
const notFoundPath = join(outDir, "404.html");

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath);
}
