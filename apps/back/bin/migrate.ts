import dotenv from "dotenv";
import path from "node:path";
import process from "node:process";
import { readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "url";

import type { PathLike } from "node:fs";

dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });

const { DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const migrations_dir: PathLike = fileURLToPath(path.join(import.meta.url, "../../migrations"));

const args: string[] = process.argv;
const clean: boolean = args.length > 2 && (args.includes("clean") || args.includes("--clean")) ? true : false;
const clean_only: boolean =
  args.length > 2 && (args.includes("clean-only") || args.includes("--clean-only")) ? true : false;

const slq_import_command: string = `mysql -u ${DB_USER} -p"${DB_PASSWORD}" ${DB_DATABASE} < `;

function migrate_clean(migrations_dir: PathLike): void {
  const basedir = migrations_dir.toString();
  const file: string = readdirSync(basedir)[0];
  const filepath: PathLike = path.join(basedir, file);
  console.log("  - 🗑️ cleaning all tables...");
  execSync(slq_import_command + filepath);
  console.log("  - 👌 tables cleaning OK!");
}

function migrate_local(migrations_dir: PathLike, clean: boolean = false): void {
  const basedir: string = migrations_dir.toString();
  const files: string[] = readdirSync(basedir);

  if (clean) migrate_clean(migrations_dir);

  console.log(`  - ➡️ Starting migrations to ${DB_DATABASE}...`);

  for (const file of files.slice(1)) {
    const filepath: PathLike = path.join(basedir, file);
    execSync(slq_import_command + filepath);
  }
  console.log("  - 👌 migrations OK!");
}

console.log("🚀 Starting migrations script 🚀\n");

switch (clean_only) {
  case true:
    migrate_clean(migrations_dir);
    break;
  case false:
    migrate_local(migrations_dir, clean);
    break;
}

process.exit(0);
