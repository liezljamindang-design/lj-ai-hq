# LJ AI Headquarters

An interactive demo of AI employees working inside an automated CRM. A portfolio project by Liezl Jamindang, GoHighLevel Specialist.

Visitors walk a small isometric office, meet six AI employees, open a CRM dashboard and a workflow diagram, and run a simulated lead journey from first inquiry to booked appointment.

**Almost everything a visitor sees is demo data.** No real clients, contacts or CRM integrations are involved. Three things are real: Liezl's own profile in the Executive Office, the **Request a quote** form (it sends the visitor's details to Liezl), and, once a key is set, the **live AI chat**.

## Run it

```bash
npm install
npm run dev      # local development
npm run build    # type-check and build to dist/
```

Built with React, Vite and TypeScript. The one added library is Zustand, a small state store.

## Deploy

1. Import this repository into [Vercel](https://vercel.com). It detects Vite; the defaults are correct.
2. In the Vercel project, add the domain `hq.liezljamindang.site`.
3. At the DNS provider, add the CNAME record Vercel shows for `hq`.
4. Add the button to the GoHighLevel portfolio by following `integration/ghl-cta.html`.

"Exit HQ" returns visitors to the portfolio. Change the address with the `VITE_PORTFOLIO_URL` variable (see `.env.example`).

## Turning on the real features

Both are off until their settings exist in **Vercel → Settings → Environment Variables**. After adding or changing one, redeploy. Never put these values in the code or in a `VITE_` variable.

### Request a quote form

Visitors enter first name, last name, email, services needed and notes. `api/lead.js` validates it and forwards it. Choose one delivery route:

- **GoHighLevel (recommended).** Create a workflow with the **Inbound Webhook** trigger, copy its URL into `LEAD_WEBHOOK_URL`, then add actions: Create/Update Contact (map `first_name`, `last_name`, `email`), and an internal notification by email (and WhatsApp or SMS if you use them). The payload also carries `services_needed`, `notes` and `source`.
- **Resend.** Set `RESEND_API_KEY`. The inquiry is emailed to `LEAD_TO_EMAIL` (Liezl's address by default).

Until one is set, the form tells the visitor it couldn't send and offers a ready-made email instead, so nothing is lost.

### Live AI chat

Set `ANTHROPIC_API_KEY`. The employees then answer through Claude, with the rules in `api/_personas.js`: stay on topic, keep replies short, never commit to a price or timeline, never claim to have taken an action, and send people to the quote form. Without the key, or if the AI call fails, they answer from the written knowledge base.

Set a **monthly spend limit in the Anthropic console**. The endpoint limits each visitor's messages and keeps replies short, but that only slows abuse; the spend limit is the real cap.

### Not built yet

- **AI employees taking real actions** in GoHighLevel (creating contacts, booking, moving opportunities).
- **Quotes** generated from a rate card, with approval by Liezl before the client sees them.
- **Payments** through Xendit (GCash), with payment confirmation reported back automatically.

## Where to edit content

| To change | Edit |
|---|---|
| Name, title, email, phone, portfolio link | `src/ai-hq/config.ts` |
| About, skills, experience, certifications | `src/ai-hq/data/profile.ts` |
| Portfolio projects, screenshots and links | `src/ai-hq/data/projects.ts` |
| AI employees | `src/ai-hq/data/agents.ts`, `agentContent.ts` |
| What the employees answer without live AI (English and Taglish knowledge base, niches) | `src/ai-hq/data/knowledge.ts` |
| The live AI's instructions for each employee | `api/_personas.js` |
| CRM leads and numbers | `src/ai-hq/data/crm.ts` |
| The workflow | `src/ai-hq/data/workflow.ts` |
| The live demo's steps | `src/ai-hq/demo/script.ts` |
| Rooms and furniture | `src/ai-hq/data/zones.ts`, `furniture.ts` |
| Colors and fonts (matched to the portfolio) | `src/ai-hq/styles/tokens.css` |
| The CV file | `public/Liezl_Jamindang_GoHighLevel_Specialist_CV.pdf` |

## Structure

```
src/ai-hq/
  components/   panels, top bar, dialogs
  office/       isometric drawing, movement rules, pathfinding
  demo/         the live demo script and its runner
  services/     interfaces and the mock implementations behind them
  data/         demo data and profile content
  store/        shared state
  hooks/        data loading and the movement loop
  audio/        generated ambient music
  styles/       design tokens and styles
api/            serverless functions: lead.js (quote form), chat.js (live AI)
```

## Connecting real systems later

The interface never talks to an integration directly. It calls the interfaces in `src/ai-hq/services/types.ts`, and `services/index.ts` chooses the implementation. V1 uses mocks. To go live, write implementations that call **your own backend** and swap them in there.

Rules for that work:

- **No secrets in the browser.** GoHighLevel tokens, AI API keys, n8n credentials and webhook URLs belong in serverless functions or another server. Only `VITE_` values that are safe to publish may be used client-side.
- **Reads and writes stay separate.** The CRM service is read-only today. Add writes as a separate interface.
- **High-impact actions need a person.** Bulk messages, deletions, automation changes and high-value moves should go through an approval step, as the simulated approval card shows.
- **Approval notifications are composed, not sent.** `notificationService` writes the email and Slack message the demo shows. To send them for real, call it from a serverless function that holds the Slack incoming-webhook URL and the email credentials, or trigger a GoHighLevel workflow that sends the email. Only do this for real approval requests, never from the public demo, or any visitor could trigger messages to you.
- **Admin mode is reserved, not built.** `config.ts` has a `mode` value for a future private build. Keep private features out of the public demo bundle.
