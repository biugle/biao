import { access, mkdir, readFile, rm, symlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
const run = promisify(execFile);
const root = resolve(new URL("..", import.meta.url).pathname);
const workRoot = resolve(root, ".scenario-work");
const cliSource = resolve(root, "packages/cli/src/cli.ts");
const tsxBin = resolve(root, "packages/cli/node_modules/.bin/tsx");
const environments = ["local", "dev", "test", "pre", "prod"];
const locales = ["zh-CN", "en-US"];
const portalPresets = ["sidebar", "topbar"];
const appPresets = ["sidebar", "blank", "dashboard", "mobile", "custom"];

async function command(args, cwd) {
  await run(tsxBin, [cliSource, ...args], {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function assertProject(projectRoot, type, preset) {
  const config = await readFile(resolve(projectRoot, "biu.config.ts"), "utf8");
  const packageJson = JSON.parse(await readFile(resolve(projectRoot, "package.json"), "utf8"));
  if (!config.includes('projectType: "' + type + '"')) throw new Error("project type mismatch");
  if (!config.includes('preset: "' + preset + '"')) throw new Error("preset mismatch");
  if (!packageJson.scripts.start || !packageJson.scripts.build) throw new Error("missing project scripts");
  for (const file of ["local-routes/index.ts", "src/pages", "config/local.ts", "public/index.html"]) {
    await access(resolve(projectRoot, file));
  }
}

async function createScenario(index, type, preset, environment, locale) {
  const name = "case-" + String(index + 1).padStart(3, "0");
  await command(["--lang=" + locale, "create", name, "--type", type, "--preset", preset], workRoot);
  const projectRoot = resolve(workRoot, name);
  await assertProject(projectRoot, type, preset);
  return { name, projectRoot, environment, locale, type, preset };
}

const scenarios = [];
let index = 0;
try {
  await rm(workRoot, { recursive: true, force: true });
  await mkdir(workRoot, { recursive: true });
  await symlink(
    resolve(root, "examples/dev-demo/apps/child-app/node_modules"),
    resolve(workRoot, "node_modules"),
    "dir",
  );

  for (const [type, presets] of [
    ["PORTAL", portalPresets],
    ["APP", appPresets],
  ]) {
    for (const preset of presets) {
      for (const environment of environments) {
        for (const locale of locales) {
          scenarios.push(await createScenario(index, type, preset, environment, locale));
          index += 1;
        }
      }
    }
  }

  while (index < 100) {
    const type = index % 2 === 0 ? "PORTAL" : "APP";
    const presets = type === "PORTAL" ? portalPresets : appPresets;
    const preset = presets[index % presets.length];
    const environment = environments[index % environments.length];
    const locale = locales[index % locales.length];
    scenarios.push(await createScenario(index, type, preset, environment, locale));
    index += 1;
  }

  const buildCases = scenarios.filter((item) => item.locale === "zh-CN").slice(0, 7);
  for (const scenario of buildCases) {
    await command(["build", "--all", "--env", "local"], scenario.projectRoot);
    await access(resolve(scenario.projectRoot, "dist/index.html"));
    await access(resolve(scenario.projectRoot, "dist/manifest/index.json"));
  }
  console.log(
    "[biu] verified " + scenarios.length + " CLI/project scenarios and " + buildCases.length + " representative builds",
  );
} finally {
  await rm(workRoot, { recursive: true, force: true });
}
