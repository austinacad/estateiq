# EstateIQ on Vercel: staging first

GitHub is the source of truth. `main` holds the imported V8 baseline; `develop` holds ongoing work. Austin must approve a production release. Do not import the GitHub repository through Vercel's one-click Git setup: importing the default `main` branch can make an initial production deployment. Create a Vercel project without Git import and connect this repository through the guarded GitHub Actions preview workflow below.

## Current state

- Pushes to `develop` check JavaScript syntax, package the five website pages and assets, check local links and the disabled live AI endpoint, and save a staging artifact.
- `vercel.json` packages only `dist/` and disables Vercel's automatic Git deployments. GitHub Actions is the only prepared staging deployment path. No production deployment command or workflow exists.
- The Vercel staging job remains off until the GitHub variable `STAGING_DEPLOY_ENABLED` is set to `true`. It uses `vercel deploy --prebuilt` **without** `--prod` and can only run on a `develop` push after validation passes.
- The OpenAI Advisor remains a fictional-data demo because `live-ai-config.js` has a blank endpoint. Real customer data and live AI requests are not enabled.

## Enable a protected Vercel preview

1. Connect the Vercel account and create an EstateIQ project **without importing GitHub or making a production deployment**. Configure Vercel Authentication with Standard Protection for preview URLs in the project settings. Confirm the project is protected before deploying.
2. Add GitHub repository Settings → Environments → `staging`. Restrict it to `develop`. Add environment secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` for the Vercel project. Obtain the two IDs from the project's `.vercel/project.json` after linking with Vercel CLI, or from Vercel's project details. Keep the token out of Git and chat.
3. In GitHub Settings → Secrets and variables → Actions → Variables, set `STAGING_DEPLOY_ENABLED` to `true`. Push a checked change to `develop`. The Actions run will build and deploy a Vercel **Preview** URL. Review it on desktop and mobile before any release.

## Production, later

There is no automatic production path. Keep `git.deploymentEnabled` disabled and do not add a `--prod` deployment command until Austin explicitly approves a reviewed release. Do not merge the staging pull request or change the production site before approval. The separate Cloudflare Worker needs server-side authentication, usage limits, and other controls before any real customer data or live Advisor access.
