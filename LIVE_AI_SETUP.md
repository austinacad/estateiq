# EstateIQ V7 — free live AI setup

**Status:** the integration code is implemented, but it is NOT deployed or activated. Cloudflare requires your own account and an exact published website origin. Do not enter real clients, email threads or brokerage records into this development demo.

## Deploy the backend
1. Create a free Cloudflare account. Install Node.js on your computer.
2. Open a terminal in `worker/`. Run `npx wrangler login`.
3. Run `npx wrangler secret put ALLOWED_ORIGIN` and enter the exact origin of the site you published, e.g. `https://estateiq-example.netlify.app` (NO trailing slash or path).
4. Run `npx wrangler deploy`. Copy the HTTPS workers.dev URL returned.
5. Edit `live-ai-config.js` to `window.ESTATEIQ_LIVE_AI = { endpoint: 'https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev' };` (no secrets).
6. Publish the WHOLE updated website folder to Netlify or Cloudflare Pages. Open the site over HTTPS. Open dashboard > AI Advisor and ask a real-estate question.
7. Leave endpoint blank to keep the scripted offline demo.

## Security and limitations
- The backend enforces an exact browser origin for the development demo, but Origin/CORS is NOT authentication and can be spoofed outside a browser. Do not promote this to a public paid product without verified user identity, per-user/brokerage usage quotas, abuse protection, tenant isolation, audit logs, and appropriate retention controls.
- The advisor has live generative AI but does NOT have real CRM, email, licensed property feeds, online search, brokerage analytics or server-side customer memory. It only receives a short conversation and demo personalization settings.
- No secret Cloudflare API token is embedded in website JavaScript; the Worker uses an AI binding.
- Users must approve external actions; this release has NO external write functionality.
- Cloudflare free quotas may change, and requests will stop working if the allocation is exhausted.
- Cloudflare Workers AI pricing and model information: https://developers.cloudflare.com/workers-ai/platform/pricing/ and https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/
