# EstateIQ Vercel deployment

GitHub is the source of truth. `main` holds the imported V8 baseline. `develop` holds later work and draft PR #1. The website is currently live as a **public product demo** on Vercel:

https://estateiq-staging-2qv6yr8re-austinacad17-7635.vercel.app/

The Vercel project is `estateiq-staging` in team `austinacad17-7635` (project `prj_1OcaMt4hVktXa2q0V6EsOezCpZd8`, team `team_DZs3GtK4asDQ9nIYQgwGIulH`). The initial live deployment was created from the checked `develop` package. Vercel classified this **first API deployment as Production** despite the request omitting a production target. Do not assume an omitted target is safe on a new project.

## What works now

- Landing page, interactive dashboard, and Advisor screens load at the generated Vercel URL.
- All customer names, listings, metrics, and advisor responses are fictional examples stored locally in the visitor's browser.
- The sign-in screen is a design preview. Google, Apple, Microsoft, and email authentication are not connected. The dashboard demo is publicly accessible.
- The OpenAI Advisor Worker is not deployed. `live-ai-config.js` has a blank endpoint, so the Advisor uses a scripted local simulation.
- The pricing page describes proposed plans. Its trial request form still uses Netlify Forms and **does not collect submissions on Vercel**. Billing and live trials are not active. Do not promote the trial request flow as working until it is replaced and tested.

## Release controls

- Vercel Git deployments remain disabled in `vercel.json`; there is no automatic production release on a GitHub push.
- GitHub `STAGING_DEPLOY_ENABLED` is `false`. The Vercel deployment job and unsafe API deployment script were removed from `develop` after the first API deployment selected Production. GitHub Actions now only validates, packages, and saves a staging artifact.
- The GitHub `staging` environment is restricted to `develop` and has a project-only Vercel token expiring October 25, 2026. It cannot be used with `vercel pull` in the current CLI setup. Rotate or revoke it when a safe preview deployment method is chosen.
- Vercel Authentication shows Standard Protection for preview deployments. It does **not** make the current production demo or its dashboard private.
- Future edits to production require Austin's approval. Keep the draft PR unmerged until reviewed.

## Next setup

1. Establish a preview deployment method with its target verified **before** deploying; keep the public URL and any real customer workspace separate. A private dashboard needs real login and access control, not just a subdomain name.
2. Connect a domain after Austin purchases it. Cloudflare can register/manage DNS while Vercel serves the site.
3. Before offering real accounts or paid plans, add a production authentication and data backend, protect each customer's data, connect the AI Worker server-side, and set up billing. Do not enter real customer data into the current demo.
