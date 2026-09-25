import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'dist');
const pages = ['index.html', 'dashboard.html', 'auth.html', 'account.html', 'thank-you.html', 'booking.html'];
const missing = [];

for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  for (const [, target] of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
    if (/^(?:https?:|data:|mailto:|tel:|#|\/\/)/i.test(target)) continue;
    const path = target.split(/[?#]/)[0];
    if (!path) continue;
    try { await stat(resolve(root, dirname(page), path)); }
    catch { missing.push(`${page}: ${target}`); }
  }
}

const files = await readdir(root);
if (files.some(file => ['worker', '.github', 'OPENAI_SETUP.md', 'DEPLOYMENT.md'].includes(file))) {
  throw new Error('Development source was included in the public website package.');
}
if (missing.length) throw new Error(`Missing local references:\n${missing.join('\n')}`);
const ai = await readFile(resolve(root, 'live-ai-config.js'), 'utf8');
if (!/endpoint:\s*['"]['"]/.test(ai)) throw new Error('Public package must keep the unauthenticated live AI endpoint disabled.');
console.log(`Checked ${pages.length} pages, their local references, and the disabled live AI endpoint.`);
