# EstateIQ — authentication setup (Google, Apple, Microsoft, email)

The authentication **interface and Supabase client integration** are in this package. It is intentionally **not connected to a real project**: you must create your own Supabase project, configure each identity provider, and publish the site before the buttons can authenticate. The dashboard remains a fictional demonstration and is NOT protected by customer authentication.

## What is implemented
- Responsive sign-in / sign-up page with email magic links and Google, Apple, Microsoft OAuth.
- Authenticated account page, session detection, sign-out, and provider-identity linking UI.
- Optional TOTP enrollment and challenge using Supabase MFA APIs.
- Honest, non-submitting preview state when config is absent; real error/status messages when configured.
- No mailbox/contacts/calendar access from sign-in and no secret keys bundled.

## Activate in your project
1. Publish the extracted folder to HTTPS on Netlify or another static host. For local development, serve over HTTP, e.g. `python -m http.server 8080`; opening via `file://` is preview only.
2. Create a **Supabase** project. In its Auth URL configuration, set the Site URL to your deployed site (e.g. `https://your-site.netlify.app`) and add the exact allowed redirect URLs for `/auth.html` and `/account.html` for each authorized domain. Don't use an unrestricted wildcard in production.
3. Copy the Supabase **Project URL** and **publishable/anon key** into `auth-config.js`. These are browser-facing project values. Do **not** paste a service-role key or any provider client secret into the website.
4. Enable Email in Supabase Auth. Configure production SMTP, email templates, rate limits, and a verified sender before real customers. Email sign-in is magic link; on Sign in (`shouldCreateUser: false`) it will not intentionally register a new user; Create account permits registration.
5. Enable Google: create a Google Cloud OAuth web client and add Supabase's `https://<project-ref>.supabase.co/auth/v1/callback` as the provider's authorized redirect URI. Add client ID/secret **only in Supabase's provider dashboard**. Configure the Google OAuth consent screen.
6. Enable Apple: configure Apple Sign in (Service ID/domain/return URL and key), and add credentials only to Supabase provider dashboard. Apple may require additional paid developer-account setup.
7. Enable Azure (Microsoft Entra): register an app; set its web redirect URI to Supabase's `/auth/v1/callback`; add client ID/secret in Supabase. The code requests only the `email` scope for sign-in. Check the chosen supported account types and tenant.
8. If offering sign-in-method linking, enable manual identity linking in your Supabase Auth settings and test with already-authenticated users. Don't silently merge accounts based on unverified email addresses.
9. Test email, each OAuth provider, refresh, signed-in state, sign-out, TOTP setup, TOTP challenge, and account linking on a deployed **test domain** before exposing production sign-in. In the Supabase dashboard, confirm production redirect allowlists and provider setup.

## Security and production integration
- **Do not treat `dashboard.html` as private.** It intentionally contains only fictional demo data, remains public, and never reads account data. Link the authenticated frontend to real private screens only after backend tenant authorization and RLS policies are built.
- A signed-in user is NOT automatically an active paying customer or a member of any brokerage. Subscription entitlements and brokerage memberships must be checked **server-side**.
- Brokerage invitation workflow requires server-side creation of expiring, single-use invite tokens, identity/email verification, membership approval, role checks, seat limits, auditing, and offboarding. Do not use a browser button or user-editable field to grant the owner/admin role. The UI includes explanatory placeholder only.
- Require `aal2` TOTP for elevated brokerage administrator actions on the server/database (not just by hiding front-end buttons). Design support for lost-device recovery and backup enrolled factors before mandating MFA.
- Implement user-private and tenant-private data via Postgres Row Level Security. Never expose Supabase service-role credentials in the browser. Store integration credentials/tokens server-side using encryption and minimum scopes.
- Provider sign-in is deliberately separate from Gmail, Google Contacts/Calendar and Microsoft 365 data connections; those require a second, explicit integration authorization.
- Add privacy policy, retention/deletion/export process, abuse controls, monitoring, provider review and custom SMTP before collecting customer data.

## Reference
Official Supabase guides: https://supabase.com/docs/guides/auth/social-login , https://supabase.com/docs/guides/auth/auth-email-passwordless , https://supabase.com/docs/reference/javascript/auth-linkidentity , https://supabase.com/docs/reference/javascript/auth-mfa-enroll
