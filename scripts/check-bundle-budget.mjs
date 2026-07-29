import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DIST_ASSETS = path.resolve('dist/assets');
const MAX_CHUNK_BYTES = 350 * 1024;
const MAX_TOTAL_BYTES = 1024 * 1024;

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const resolved = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(resolved) : [resolved];
  }));
  return nested.flat();
}

let files;
try {
  files = await listFiles(DIST_ASSETS);
} catch {
  console.error('Bundle budget check failed: dist/assets is missing. Run npm run build first.');
  process.exit(1);
}

const javascriptFiles = files.filter(file => file.endsWith('.js'));
const sizes = await Promise.all(javascriptFiles.map(async file => ({
  file: path.relative('dist', file),
  bytes: (await stat(file)).size,
})));
const totalBytes = sizes.reduce((sum, item) => sum + item.bytes, 0);
const oversized = sizes.filter(item => item.bytes > MAX_CHUNK_BYTES);

if (javascriptFiles.length < 2) {
  console.error('Bundle budget check failed: route-level code splitting produced fewer than two JavaScript chunks.');
  process.exit(1);
}

if (oversized.length > 0 || totalBytes > MAX_TOTAL_BYTES) {
  for (const item of oversized) {
    console.error(`Oversized chunk: ${item.file} (${(item.bytes / 1024).toFixed(1)} KiB)`);
  }
  if (totalBytes > MAX_TOTAL_BYTES) {
    console.error(`Total JavaScript exceeds budget: ${(totalBytes / 1024).toFixed(1)} KiB`);
  }
  process.exit(1);
}

const largest = sizes.reduce((current, item) => item.bytes > current.bytes ? item : current);
console.log(
  `Bundle budget passed: ${sizes.length} chunks, `
  + `${(totalBytes / 1024).toFixed(1)} KiB total, `
  + `largest ${largest.file} at ${(largest.bytes / 1024).toFixed(1)} KiB.`,
);
