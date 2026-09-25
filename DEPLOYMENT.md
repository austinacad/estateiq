# EstateIQ deployment workflow

GitHub `main` is the imported V8 baseline. Use `develop` for changes and staging. Never connect `main` to automatic production publishing: production requires Austin's explicit approval for each release.

## What exists now

- `develop` pushes run syntax checks, package the five pages and their assets, check local links, and save a staging artifact in GitHub Actions.
- Only files in `dist/` are deployed. The Worker, deployment notes and repository files are excluded.
- The live AI endpoint is blank in this version. Real accounts, client data, CRM and MLS feeds are not connected. Use fictional sample data only.
- A staging deployment job is prepared but stays disabled until `STAGING_DEPLOY_ENABLED` is set to `true`. It deploys a **draft**, without `--prod`, to a separate Netlify staging site.

## Activate the live staging site

1. Create a separate **staging** site in Netlify. Do not connect its Git integration to `main` or enable automatic production deploys. The publish directory is `dist` (no build framework; run `node scripts/package-site.mjs --staging` for a manual build).
2. Enable Netlify's deployment access protection on the staging site before sharing its URL. A draft URL and `robots.txt` do not restrict access.
3. In GitHub repository Settings → Environments, create `staging`, allow deployments only from `develop`, and add environment secrets `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` for the **staging site**. Keep both values out of source.
4. In GitHub Settings → Secrets and variables → Actions → Variables, set `STAGING_DEPLOY_ENABLED` to `true`. The next push to `develop` runs checks and deploys the static draft at an `estateiq-review` alias. Review the URL in the workflow run and test desktop, mobile, navigation and demo workflows.

## Production release, later

Keep the production host disconnected from automatic `main` publishing. Open a pull request from `develop` to `main`, inspect the diff and staging preview, and wait for explicit approval before merging or publishing. Set up a separate production site and secrets only at release time. The production deployment must be a manual, approval-gated operation; a merge alone must not publish.

The OpenAI Worker is separate from static hosting. `OPENAI_SETUP.md` describes it, but the development Worker lacks server-side authentication and rate limits. Do not activate its public URL or enter customer information until those controls are implemented and tested. CORS by itself is not authentication.
