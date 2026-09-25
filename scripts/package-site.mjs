import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
const files = [
  'index.html', 'dashboard.html', 'auth.html', 'account.html', 'thank-you.html',
  'styles.css', 'landing-v2.css', 'dashboard.css', 'auth.css',
  'app.js', 'dashboard.js', 'auth.js', 'auth-config.js', 'live-ai-config.js',
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await cp(resolve(root, file), resolve(output, file));
await cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });

if (process.argv.includes('--staging')) {
  await writeFile(resolve(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
}

console.log(`Packaged ${files.length} website files and assets in dist/`);
