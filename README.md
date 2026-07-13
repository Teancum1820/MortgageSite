# MortgageSite

A Next.js PWA starter for a mortgage lead generation site. It includes:

- Mobile-first landing experience
- Two-step mortgage lead form with TCPA-style consent
- Affordability/payment calculator
- Thank-you flow
- Privacy, terms, and licensing pages
- PWA manifest and service worker
- Development lead capture to `data/leads.jsonl`
- Optional `LEADS_WEBHOOK_URL` for CRM or automation handoff

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Temporary GitHub Pages Hosting

GitHub Pages is static hosting, so it cannot run the Next.js `/api/leads` route. For testing on Pages, use:

```bash
npm run build:github
```

This writes a static site to `out/` configured for:

- repo path: `/MortgageSite/`
- static assets under `/MortgageSite/_next/`
- PWA manifest and service worker paths under `/MortgageSite/`
- lead-form testing mode that saves submissions in the visitor's browser `localStorage`

To publish manually, deploy the contents of `out/` to GitHub Pages. For a GitHub Actions Pages workflow, use `npm run build:github` as the build command and upload `out/` as the Pages artifact.

Testing-mode leads can be inspected in the browser console:

```js
JSON.parse(localStorage.getItem("mortgageSiteTestLeads") || "[]")
```

Do not use GitHub Pages lead storage for real leads. It is only a temporary UI test mode.

## Configure

Copy `.env.example` to `.env.local` and update the values:

```bash
NEXT_PUBLIC_SITE_NAME="Your Mortgage Brand"
NEXT_PUBLIC_COMPANY_NAME="Your Company LLC"
NEXT_PUBLIC_NMLS_ID="123456"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-link"
LEADS_WEBHOOK_URL="https://your-crm-webhook.example.com"
```

## AWS Amplify Later

This app is structured for Amplify Hosting with Next.js. When you are ready:

1. Push this repo to GitHub.
2. Connect the repo in AWS Amplify Hosting.
3. Add the environment variables above in Amplify.
4. Replace the local JSONL dev storage in `app/api/leads/route.ts` with DynamoDB, AppSync, Lambda, or your CRM webhook flow.

Do not use the local JSONL file as production storage.
