import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'public', 'regalos-sin-agobios.html');
const redirectsSource = path.join(root, 'public', '_redirects');
const targetDir = path.join(root, 'dist');
const target = path.join(targetDir, 'regalos-sin-agobios.html');
const redirectsTarget = path.join(targetDir, '_redirects');

if (!fs.existsSync(source)) {
  console.warn('[postbuild] Source file not found:', source);
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
console.log('[postbuild] Copied landing to dist:', target);

if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsTarget);
  console.log('[postbuild] Copied redirects to dist:', redirectsTarget);
}
