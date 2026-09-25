import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const teamId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;
const token = process.env.VERCEL_TOKEN;

// This job is allowed to deploy only to the protected EstateIQ staging project.
if (teamId !== 'team_DZs3GtK4asDQ9nIYQgwGIulH' ||
    projectId !== 'prj_1OcaMt4hVktXa2q0V6EsOezCpZd8' || !token) {
  throw new Error('EstateIQ staging credentials are missing or point to another project.');
}

const authorization = { Authorization: `Bearer ${token}` };
const api = 'https://api.vercel.com';

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`Vercel API ${response.status}: ${body.error?.message || 'request failed'}`);
  }
  return response;
}

async function filesIn(dir, prefix = '') {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(full, name));
    else if (entry.isFile()) files.push({ name, full });
    else throw new Error(`Unsupported staging file: ${name}`);
  }
  return files;
}

// Vercel may classify the first deployment of an empty project as production,
 // even when no production target was requested. Fail BEFORE uploading or creating
 // a deployment unless the separate staging-only project has an approved READY
 // bootstrap deployment. That bootstrap is a separate, explicit user decision.
const historyResponse = await request(
  `${api}/v6/deployments?teamId=${encodeURIComponent(teamId)}&projectId=${encodeURIComponent(projectId)}&limit=50`,
  { headers: authorization },
);
const history = (await historyResponse.json()).deployments;
if (!Array.isArray(history)) {
  throw new Error('Could not verify Vercel staging deployment history; refusing deployment.');
}
const hasReadyBootstrap = history.some(deployment =>
  deployment.projectId === projectId &&
  deployment.target === 'production' &&
  (deployment.readyState === 'READY' || deployment.state === 'READY')
);
if (!hasReadyBootstrap) {
  throw new Error(
    'Staging-only Vercel project has no READY bootstrap deployment. ' +
    'Its first deployment may be classified as production. ' +
    'Do not create one without Austin\'s explicit approval; see DEPLOYMENT.md.',
  );
}

const root = path.resolve('dist');
const files = await filesIn(root);
if (!files.some(({ name }) => name === 'index.html')) {
  throw new Error('Staging package has no index.html.');
}

const uploaded = [];
for (const { name, full } of files) {
  const bytes = await readFile(full);
  const sha = createHash('sha1').update(bytes).digest('hex');
  await request(`${api}/v2/files?teamId=${encodeURIComponent(teamId)}`, {
    method: 'POST',
    headers: { ...authorization, 'Content-Type': 'application/octet-stream', 'x-vercel-digest': sha },
    body: bytes,
  });
  uploaded.push({ file: name, sha, size: bytes.length });
}
console.log(`Uploaded ${uploaded.length} checked staging files.`);

// Requesting an ordinary preview after the approved staging-only bootstrap. The API\n// treats an omitted target as preview on an initialized project; verify the result.
const response = await request(`${api}/v13/deployments?teamId=${encodeURIComponent(teamId)}`, {
  method: 'POST',
  headers: { ...authorization, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'estateiq-staging',
    project: projectId,
    files: uploaded,
    projectSettings: { framework: null },
    meta: { githubCommitSha: process.env.GITHUB_SHA || '' },
  }),
});
const deployment = await response.json();
if (!deployment.id || !deployment.url || deployment.target === 'production') {
  throw new Error('Vercel did not return a preview deployment.');
}
console.log(`Preview: https://${deployment.url}`);

for (let attempt = 0; attempt < 90; attempt++) {
  const statusResponse = await request(
    `${api}/v13/deployments/${encodeURIComponent(deployment.id)}?teamId=${encodeURIComponent(teamId)}`,
    { headers: authorization },
  );
  const status = await statusResponse.json();
  if (status.target === 'production') throw new Error('Unexpected production target.');
  if (status.readyState === 'READY') {
    console.log('Protected staging preview is ready.');
    process.exit(0);
  }
  if (status.readyState === 'ERROR' || status.readyState === 'CANCELED') {
    throw new Error(`Preview failed: ${status.errorMessage || status.readyState}`);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
}
throw new Error('Preview did not become ready within three minutes.');
