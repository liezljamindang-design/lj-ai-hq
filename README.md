# LJ AI Headquarters

An interactive demo of AI employees working inside an automated CRM. A portfolio project by Liezl Jamindang, GoHighLevel Specialist.

Visitors walk a small isometric office, meet five AI employees, open a CRM dashboard and a workflow diagram, and run a simulated lead journey from first inquiry to booked appointment.

**Everything a visitor sees is demo data.** No real clients, contacts, credentials or integrations are involved. The only real information is Liezl's own profile in the Executive Office.

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

## Where to edit content

| To change | Edit |
|---|---|
| Name, title, email, phone, portfolio link | `src/ai-hq/config.ts` |
| About, skills, experience, certifications | `src/ai-hq/data/profile.ts` |
| Portfolio projects, screenshots and links | `src/ai-hq/data/projects.ts` |
| AI employees | `src/ai-hq/data/agents.ts`, `agentContent.ts` |
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
```

## Connecting real systems later

The interface never talks to an integration directly. It calls the interfaces in `src/ai-hq/services/types.ts`, and `services/index.ts` chooses the implementation. V1 uses mocks. To go live, write implementations that call **your own backend** and swap them in there.

Rules for that work:

- **No secrets in the browser.** GoHighLevel tokens, AI API keys, n8n credentials and webhook URLs belong in serverless functions or another server. Only `VITE_` values that are safe to publish may be used client-side.
- **Reads and writes stay separate.** The CRM service is read-only today. Add writes as a separate interface.
- **High-impact actions need a person.** Bulk messages, deletions, automation changes and high-value moves should go through an approval step, as the simulated approval card shows.
- **Admin mode is reserved, not built.** `config.ts` has a `mode` value for a future private build. Keep private features out of the public demo bundle.
