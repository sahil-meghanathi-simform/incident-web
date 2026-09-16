/**
 * §2.6 step 3: recomputes hashes of the vendored contracts and fails CI on drift
 * against the manifest incident-api last exported.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONTRACTS_DIR = join(__dirname, '..', 'src', 'api', 'contracts');
const MANIFEST_PATH = join(CONTRACTS_DIR, 'contracts.manifest.json');

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else if (entry.endsWith('.ts')) out.push(full);
  }
  return out;
}

function main(): void {
  if (!existsSync(MANIFEST_PATH)) {
    console.error('contracts.manifest.json missing — run npm run contracts:sync first.');
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as { files: Record<string, string> };

  let drift = false;
  for (const file of listFiles(CONTRACTS_DIR)) {
    const rel = relative(CONTRACTS_DIR, file);
    const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
    if (manifest.files[rel] !== hash) {
      console.error(`DRIFT: ${rel} does not match the manifest hash`);
      drift = true;
    }
  }

  if (drift) {
    console.error('Contract drift detected — run npm run contracts:sync and commit the result.');
    process.exit(1);
  }
  console.log('contracts match the manifest — no drift');
}

main();
