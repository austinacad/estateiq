# EstateIQ V8 — OpenAI-powered advisor setup

**Status: integration source code is ready, but it is not deployed or live.** This is a development demo with fictional data, not a secure production SaaS. OpenAI API usage is billed separately from ChatGPT.

## 1. Create the API key
Sign in to https://platform.openai.com/ and create an API key in an OpenAI API project. Configure billing and a small project usage budget/alerts. Keep the key private; do not paste it into HTML, frontend JavaScript, chat, or a public repository.

## 2. Deploy the Cloudflare Worker (now calling OpenAI, not Workers AI)
With Node.js installed, open a terminal inside `worker/` and run:

```
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ALLOWED_ORIGIN
npx wrangler deploy
```

For `ALLOWED_ORIGIN`, enter the *exact HTTPS origin* of your published website, e.g. `https://your-site.netlify.app` (no trailing slash or path). Save the generated `https://...workers.dev` URL.

## 3. Connect the site
Edit `live-ai-config.js` to set `window.ESTATEIQ_LIVE_AI = { endpoint: 'https://YOUR-WORKER.workers.dev' };`. Redeploy the entire website folder to Netlify or your host. In Dashboard → AI Advisor, ask a question. If the endpoint is blank, the existing scripted demo remains active.

## What is and isn't connected
The live model supports real estate questions and receives the question, short chat history, and browser-stored user preferences. It does not retrieve actual CRM data, Google messages, business analytics, or licensed property records. It does not send emails or update external records. The UI uses fictional data.

## Security before any public customer launch
`ALLOWED_ORIGIN` is only a browser CORS restriction, **not authentication**. A public endpoint can be called outside the browser. Before admitting real customers: enforce verified identity server-side, account and brokerage isolation, per-user usage quotas, rate limiting and abuse controls, approved data-source retrieval, retention/deletion controls, and logs without client secrets. Do not enter real client data in this version. Review model-provider data-handling terms before processing customers' information.

Official docs: https://platform.openai.com/docs/quickstart and https://platform.openai.com/docs/api-reference/introduction
