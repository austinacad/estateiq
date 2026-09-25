# EstateIQ V8 — OpenAI Advisor draft

Preserves the existing EstateIQ website and midnight-green dashboard. Changes the live AI backend from Cloudflare Workers AI to the OpenAI Responses API, while retaining Cloudflare Workers as the server-side proxy. This avoids exposing an API key in the browser.

**Not activated:** Requires your OpenAI API key, Cloudflare account, deployment, and published website address. Follow `OPENAI_SETUP.md`. The advisor uses fictional-data workflows and browser-local personalization; CRM and property feeds are not connected.

Open `index.html` for the offline website. For live AI, publish the complete folder and configure `live-ai-config.js`. For continued development, previous specs and roadmaps remain in this package, but `OPENAI_SETUP.md` supersedes the older `LIVE_AI_SETUP.md`.

## Version control and deployment

This package is the GitHub-ready V8 starting point. See [DEPLOYMENT.md](DEPLOYMENT.md) for the private-repository, staging, CI, and deployment workflow. The AI is not live until the separate backend is deployed and configured.
