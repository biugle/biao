import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

if (existsSync(".git")) execFileSync("husky", [], { stdio: "inherit" });
