// One-off SQL runner against the project's Supabase Postgres database.
// Lets schema/data changes be applied directly (via DATABASE_URL in
// .env.local) instead of copy-pasting into the Supabase SQL editor.
//
// Usage:
//   node scripts/run-sql.mjs path/to/file.sql
//   node scripts/run-sql.mjs -e "select 1;"

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  let content;
  try {
    content = readFileSync(envPath, "utf-8");
  } catch {
    return;
  }
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const args = process.argv.slice(2);
let sql;

if (args[0] === "-e") {
  sql = args[1];
} else if (args[0]) {
  sql = readFileSync(args[0], "utf-8");
} else {
  console.error("Usage: node scripts/run-sql.mjs <file.sql>  |  node scripts/run-sql.mjs -e \"<sql>\"");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const result = await client.query(sql);
  const results = Array.isArray(result) ? result : [result];
  for (const r of results) {
    if (r.rows?.length) {
      console.table(r.rows);
    } else if (typeof r.rowCount === "number") {
      console.log(`${r.command ?? "OK"} (${r.rowCount} row${r.rowCount === 1 ? "" : "s"})`);
    }
  }
  console.log("✔ Success");
} catch (err) {
  console.error("✘ SQL Error:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
