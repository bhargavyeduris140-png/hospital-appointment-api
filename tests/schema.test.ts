import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("schema uses required PostgreSQL table, column and native type mappings", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  for (const table of ["patients", "doctors", "appointments"]) assert.ok(schema.includes(`@@map("${table}")`));
  assert.match(schema, /@db\.Date/);
  assert.match(schema, /@db\.Timestamp\(6\)/);
});
test("Prisma 7 PostgreSQL adapter is configured", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.match(pkg.dependencies["@prisma/client"], /^\^7/);
  assert.ok(pkg.dependencies["@prisma/adapter-pg"]);
  assert.match(readFileSync("src/lib/prisma.ts", "utf8"), /new PrismaPg/);
});
