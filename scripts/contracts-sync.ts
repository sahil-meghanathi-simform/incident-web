/**
 * §2.6 step 2: copies ../incident-api/contracts-dist/** into src/api/contracts/
 * (committed, vendored — never hand-edited). Requires a sibling checkout of
 * incident-api with contracts-dist/ already exported (npm run contracts:export there).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SRC_DIR = join(__dirname, '..', '..', 'incident-api', 'contracts-dist');
const OUT_DIR = join(__dirname, '..', 'src', 'api', 'contracts');

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function main(): void {
  if (!existsSync(SRC_DIR)) {
    console.error(
      `${SRC_DIR} does not exist. Run "npm run contracts:export" in ../incident-api first.`,
    );
    process.exit(1);
  }

  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const files = listFiles(SRC_DIR);
  for (const file of files) {
    const rel = relative(SRC_DIR, file);
    const dest = join(OUT_DIR, rel);
    mkdirSync(join(dest, '..'), { recursive: true });
    writeFileSync(dest, readFileSync(file));
  }

  console.log(`synced ${files.length} contract file(s) from ../incident-api/contracts-dist`);
}

main();
