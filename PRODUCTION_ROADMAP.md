# EstateIQ production build roadmap

This file defines remaining work. The downloadable site demonstrates the user journey and now includes a configurable sign-in front-end, but does not implement the production systems below. See `AUTH_SETUP.md` to activate the identity providers.

## Platform boundary

EstateIQ is an intelligence layer for licensed agents and brokerages, **not** a public Zillow/Propwire-style research portal or an independent brokerage. Recommended property/land records are accompanied by source-aware research. Buyer matches do not establish property availability or owner selling intent. Agents control client contact and all regulated brokerage activity.

## 1 — Accounts, tenants and permissions

- Configure the existing Supabase Auth UI for email, Google, Apple and Azure; publish to HTTPS and test each provider. The existing demo dashboard is not private.
- Deploy a backend with authenticated individual and brokerage accounts, entitlement checks and persistent profiles.
- Brokerage subscription provisions included full Agent seats. A user can belong to more than one organization with explicitly selected workspace.
- Store contacts and CRM business records under an organization and permitted assigned agent; prevent cross-customer leakage at API and database levels.
- Brokerage owners see approved aggregate metrics, and individual contact details only where their organization's policy grants access. Every elevated access event is auditable.
- Create secure invitation and offboarding flows with clear ownership/export rules. The account page previews this concept but does not issue invites.
- Enforce `aal2` MFA at the database/API layer for privileged brokerage actions; front-end TOTP setup alone is not authorization.
- Production audit trail with actor, tenant, action, requested payload, approval, execution status and timestamps.

## 2 — Authorized property data

- Obtain contracts that permit **our actual use**: programmatic access, AI analysis, storing permitted fields, commercial display to paying customers, caching and retention.
- Source property records and land parcel attributes through licensed datasets and permitted official records, prioritizing the Bay Area pilot geography.
- Carry source/provider, retrieved/verified dates, geographic coverage, reliability notes and display restrictions with every field.
- If any source does not permit display or redistribution, show an authorized source link instead of copying its records into the paid app.
- Land: verify APN, jurisdiction, zoning, legal access, easements, utility availability, hazards and intended use. Never infer buildability from a generic AI response.
- Automate shared property research separately from tenant-private CRM information.

## 3 — CRM integration and action workflow

- Begin with a consented CSV mapping/import flow on the secured backend and one CRM integration customers actually use.
- Add OAuth where provided, server-side token management, incremental sync, conflict handling and error visibility.
- Ingest contacts, status, assigned owner, documented preferences, permitted activity and lead source. Maintain provenance and deletion/export controls.
- AI suggests drafts/tasks. The agent approves exact scope and payload. A server worker performs permitted actions only after approval, then records the result and any errors in the audit trail.
- No automated homeowner outreach, negotiation or irreversible actions at launch.

## 4 — Recommendation engine and advisor

- First use deterministic buyer/property compatibility rules; evaluate real user feedback to improve ordering.
- Separate structured factual fields from model-generated interpretation. Each opportunity must include *why recommended*, *supporting evidence*, *unknowns* and *suggested next action*.
- Build server-side model calls with protected credentials, per-tenant limits and grounding in authorized user data; never put an AI API key in front-end JavaScript.
- Evaluate hallucinations, ambiguous owner intent, inaccurate valuations, zoning claims, fair-housing concerns and data leakage before production release.

## 5 — Brokerage analytics and ROI

- Ingest permissioned lead, appointment, offer, transaction and marketing-source activity with defensible metric definitions.
- Show aggregate business insights and user-scoped agent dashboards.
- Distinguish an EstateIQ-recommended action from a confirmed customer action or transaction; do not attribute causation without evidence.
- Goal progress, weekly briefings, approved export/sharing and data freshness indicators.

## 6 — Commercial and launch operations

- Legal review: company formation, real estate activity boundaries, privacy/CCPA, data broker exposure as applicable, fair housing, security terms, consumer communication consent, property-data contracts and trademark/domain clearance.
- Choose payment processor, subscription entitlements and additional-seat rules; implement usage limits and billing events.
- Set up backup/restore, logging, incident response, support, data deletion and retention.
- Run integration, permissions, penetration/security, browser, mobile, accessibility and operational tests before handling real customer data.
- Validate Agent $299 and Brokerage $1,499 (10 Agent seats) with paid pilots; pricing in the preview is provisional.

## Pilot exit criteria

Five to ten participants, real consented data through authorized sources, reproducible relevant recommendations, verified source coverage, actual customer actions logged, measured usage and cost per account, and explicit written customer willingness to continue paying.

## 7 — Free-trial implementation (V5 plan)

- Agent plan: 7 calendar days, one Agent seat. Brokerage plan: 14 calendar days, includes 10 full Agent seats in production.
- Starting the trial requires authenticated account creation, verification and explicit acceptance of trial terms; a marketing form submission must not activate a trial.
- Record `trial_started_at`, `trial_ends_at`, plan, tenant, seat limit and source on the server; enforce entitlements and fair-use limits server-side, including against repeat signups.
- No credit card required for trial and no automatic charge. At expiration switch the workspace to a clearly explained read-only or limited state; preserve/export data according to published retention rules.
- Show trial countdown, usage allowance, upgrade page and reminder notifications. Only initiate paid billing after explicit checkout/authorization.
- Verify data-licensing rights and test brokerage invitations, seat allocation, trial expiry, upgrades, cancellation and permissions.
