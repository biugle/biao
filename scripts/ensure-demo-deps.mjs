import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const demoRoot = resolve("examples/dev-demo");
const eslintBin = resolve(demoRoot, "node_modules/.bin/eslint");

if (!existsSync(eslintBin)) {
  execFileSync("pnpm", ["--dir", "examples/dev-demo", "install", "--frozen-lockfile"], {
    stdio: "inherit",
  });
}
