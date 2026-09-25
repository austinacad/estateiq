# EstateIQ on Vercel: staging first

GitHub is the source of truth. `main` holds the imported V8 baseline; `develop` holds ongoing work. Austin must approve a production release. Do not import the GitHub repository through Vercel's one-click Git setup: importing the default `main` branch can make an initial production deployment. The Vercel project was created empty without Git import; connect this repository through the guarded GitHub Actions preview workflow below.

## Current state

- Vercel project: `estateiq-staging` in account `austinacad17-7635` (project ID `prj_1OcaMt4hVktXa2q0V6EsOezCpZd8`, team ID `team_DZs3GtK4asDQ9nIYQgwGIulH`). Created empty on September 25, 2026 UTC; subsequent staging attempts returned a production-classified first deployment, so no successful protected preview has been verified. Vercel Authentication currently shows Require Log In checked with Standard Protection, which covers preview URLs.

- Pushes to `develop` check JavaScript syntax, package the five website pages and assets, check local links and the disabled live AI endpoint, and save a staging artifact.
- `vercel.json` packages only `dist/` and disables Vercel's automatic Git deployments. GitHub Actions is the only prepared staging deployment path. No production deployment command or workflow exists.
- The Vercel staging job remains off until the GitHub variable `STAGING_DEPLOY_ENABLED` is set to `true`. It uses `vercel deploy --prebuilt` **without** `--prod` and can only run on a `develop` push after validation passes.
- The OpenAI Advisor remains a fictional-data demo because `live-ai-config.js` has a blank endpoint. Real customer data and live AI requests are not enabled.

## Enable a protected Vercel preview

1. GitHub environment `staging` exists and allows only the `develop` branch. Its `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` secrets point to the Vercel project. `VERCEL_TOKEN` is also stored as a GitHub staging secret. Its Vercel scope is only `estateiq-staging`, and it expires October 24, 2026. Rotate it before then; keep its value out of Git and chat.
2. A previous first-deployment attempt was classified as `production` even though our request omitted the production target, and the build/deployment failed. The guard in `scripts/deploy-preview.mjs` now refuses to upload files or create a deployment unless this staging-only project already has a verified READY bootstrap deployment. Do **not** try to bootstrap it without Austin's explicit approval.\n3. Keep the GitHub repository variable `STAGING_DEPLOY_ENABLED` disabled while this is unresolved. Once a separate, explicitly approved staging-only bootstrap is ready, enable it, push to `develop`, and verify that the returned URL is a protected Vercel Preview and not a production alias.
4. Check the project's Deployment Protection page again before sharing a preview. It currently shows Vercel Authentication on with Standard Protection, but its setting is locked in this Hobby account, so a direct access check on the actual preview is still required.

## Production, later

There is no automatic production path. Keep `git.deploymentEnabled` disabled and do not add a `--prod` deployment command until Austin explicitly approves a reviewed release. Do not merge the staging pull request or change the production site before approval. The separate Cloudflare Worker needs server-side authentication, usage limits, and other controls before any real customer data or live Advisor access.

## Current blocker (September 24 Pacific time)

GitHub validation succeeds, but the last staging job failed after uploading 18 static files: the Vercel Create Deployment API returned a deployment that did not meet the explicit preview-only check. This first-deployment behavior cannot be safely resolved merely by omitting `target`. The connected Vercel integration currently returns `403 Forbidden` for project scope `austinacad17-7635`, preventing a fresh independent inspection. The developer must reauthenticate the correct Vercel scope and Austin must explicitly approve any staging-only bootstrap that Vercel labels `production`, even though it is not EstateIQ's public production project. No release to the real production project or main branch is authorized. GitHub PR #1 remains unmerged.
