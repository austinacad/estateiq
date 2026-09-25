# EstateIQ dedicated AI advisor — V6 specification

## Implemented in this downloadable preview
- Dedicated advisor navigation, real-estate-focused scripted responses using fictional local records.
- Editable advisor goal, focus and response-style preferences, saved locally.
- Name-aware greeting, curated business prompts, reset preferences, clear chat and clear memory controls.
- Existing explicit approval-only demo workflow remains in place.
- No live model, real customer records, CRM sync, email sending, or external action occurs.

## Production implementation (not implemented)
1. Authenticate users and isolate brokerage/agent workspaces with database row-level security.
2. Use a protected server-side AI endpoint with a real-estate/business system policy; do not expose API keys in browser assets.
3. Use retrieval from authorized CRM, analytics and property sources. Return provenance, dates and unknowns, and reject cross-tenant access.
4. Save consented preferences/memory server-side with review, edit, export and deletion controls.
5. Require explicit confirmation for all CRM writes, messages and calendar actions; record audit events.
6. Evaluate accuracy, legal-sensitive outputs, land buildability claims, prompt injection, data leakage and operational costs before release.

This is a website draft, not a secure production agent. Do not input live client data.
