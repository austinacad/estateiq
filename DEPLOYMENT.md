# EstateIQ: one project, two environments

The source in this folder is the canonical V8 website draft. Do not publish this as a customer-ready SaaS: the AI endpoint does not yet enforce authenticated account access; the dashboard uses fictional data and browser-local personalization.

## GitHub setup
1. Create a **private** GitHub repository named `estateiq`.
2. Unzip this package, open a terminal inside its folder, and run:

   ```sh
   git init
   git branch -M main
   git add .
   git commit -m "Import EstateIQ V8 website"
   git remote add origin https://github.com/YOUR_USERNAME/estateiq.git
   git push -u origin main
   ```

3. Connect the repository to Netlify (or Vercel) and deploy the static site from the repository root. There is no static build command. A push to `main` should deploy to the production site after you configure the hosting integration.
4. Create a `develop` branch for ongoing work. Configure a separate **password-protected** staging deployment for `develop` or use pull-request previews. Preview links alone are not access control.
5. Protect `main` with required review and the included `Validate EstateIQ` check. Merge changes into `main` only after testing desktop, mobile, navigation and affected workflows.

## Live AI (separate backend)
See `OPENAI_SETUP.md`. Deploy the `worker/` directory independently through Cloudflare Wrangler, put `OPENAI_API_KEY` in Worker secrets (never in GitHub or frontend code), set the exact site origin, and then configure the public Worker URL in `live-ai-config.js`.

**Important:** CORS / `ALLOWED_ORIGIN` does not authenticate users. Before exposing the AI endpoint to the public, implement server-side authentication, quotas and rate limiting. Until then leave its public endpoint unset in the deployed site. Do not upload actual customer or client data.

## Future edits
Change source on `develop` → review the preview → merge into `main` → hosting redeploys the same URL. Keep customer data in a separate database, not in static HTML or Git. Back up and migrate the database independently.
