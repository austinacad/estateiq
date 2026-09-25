# EstateIQ on Vercel: staging first

GitHub is the source of truth. `main` holds the imported V8 baseline; `develop` holds ongoing work. Austin must approve a production release. Do not import the GitHub repository through Vercel's one-click Git setup: importing the default `main` branch can make an initial production deployment. The Vercel project was created empty without Git import; connect this repository through the guarded GitHub Actions preview workflow below.

## Current state

- Vercel project: `estateiq-staging` in account `austinacad17-7635` (project ID `prj_1OcaMt4hVktXa2q0V6EsOezCpZd8`, team ID `team_DZs3GtK4asDQ9nIYQgwGIulH`). Created empty on September 25, 2026 UTC, with no production or preview deployment. Vercel Authentication currently shows Require Log In checked with Standard Protection, which covers preview URLs.

- Pushes to `develop` check JavaScript syntax, package the five website pages and assets, check local links and the disabled live AI endpoint, and save a staging artifact.
- `vercel.json` packages only `dist/` and disables Vercel's automatic Git deployments. GitHub Actions is the only prepared staging deployment path. No production deployment command or workflow exists.
- The Vercel staging job remains off until the GitHub variable `STAGING_DEPLOY_ENABLED` is set to `true`. It uses `vercel deploy --prebuilt` **without** `--prod` and can only run on a `develop` push after validation passes.
- The OpenAI Advisor remains a fictional-data demo because `live-ai-config.js` has a blank endpoint. Real customer data and live AI requests are not enabled.

## Enable a protected Vercel preview

1. GitHub environment `staging` exists and allows only the `develop` branch. Its `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` secrets point to the Vercel project. The remaining secret is `VERCEL_TOKEN`: create a token scoped to `estateiq-staging`, store it in this environment, and keep its value out of Git and chat. A 30-day token needs renewal when it expires.
2. In GitHub Settings → Secrets and variables → Actions → Variables, set `STAGING_DEPLOY_ENABLED` to `true`. Push a checked change to `develop`. The Actions run will build and deploy a Vercel **Preview** URL. Review it on desktop and mobile before any release.
3. Check the project's Deployment Protection page again before sharing a preview. It currently shows Vercel Authentication on with Standard Protection, but its setting is locked in this Hobby account, so a direct access check on the actual preview is still required.

## Production, later

There is no automatic production path. Keep `git.deploymentEnabled` disabled and do not add a `--prod` deployment command until Austin explicitly approves a reviewed release. Do not merge the staging pull request or change the production site before approval. The separate Cloudflare Worker needs server-side authentication, usage limits, and other controls before any real customer data or live Advisor access.
