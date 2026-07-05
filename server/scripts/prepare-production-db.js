import { existsSync } from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..");
const prismaCli = path.join(serverRoot, "node_modules", "prisma", "build", "index.js");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: serverRoot,
    env: process.env,
    stdio: "inherit",
    shell: false
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

if (process.env.SKIP_DB_PREPARE === "true") {
  console.log("Skipping database preparation");
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set; skipping database preparation");
  process.exit(0);
}

if (!existsSync(prismaCli)) {
  console.error("Prisma CLI is not installed. Run npm --prefix server ci before starting.");
  process.exit(1);
}

console.log("Preparing WorkSphere database schema");
run(process.execPath, [prismaCli, "db", "push", "--skip-generate"]);

if (process.env.SEED_DEMO_DATA === "false") {
  console.log("Demo seed disabled");
  process.exit(0);
}

console.log("Ensuring WorkSphere demo data");
run(process.execPath, ["prisma/seed.js"]);
