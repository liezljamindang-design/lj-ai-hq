import { useState } from "react";
import { PanelShell } from "./PanelShell";

const LAYERS = [
  {
    id: "visitor",
    name: "Visitor",
    here: "A lead arriving through a form, chat, call or ad.",
    live: "Any GoHighLevel entry point: forms, funnels, chat widget, missed calls, social lead forms.",
  },
  {
    id: "employee",
    name: "AI Employee",
    here: "Sophia, Olivia, Ava, Chloe and Mia, each with one clear job.",
    live: "Conversation AI and Voice AI agents, or an OpenAI or Claude model called from a secure backend.",
  },
  {
    id: "automation",
    name: "Automation Layer",
    here: "The workflow in the Automation Lab: triggers, conditions and actions.",
    live: "GoHighLevel workflows, with n8n and webhooks for anything that reaches outside it.",
  },
  {
    id: "crm",
    name: "CRM",
    here: "Contacts, opportunities and the five-stage pipeline in Sales & CRM.",
    live: "GoHighLevel contacts, custom fields, tags, pipelines and calendars, read and written through its API.",
  },
  {
    id: "action",
    name: "Business Action",
    here: "A booked appointment, a follow-up sent, a task for a person.",
    live: "Real appointments, messages and tasks, with human approval required for anything high-impact.",
  },
] as const;

const SKILLS = [
  "GoHighLevel", "CRM architecture", "Workflow automation", "AI agent design", "Lead management",
  "Pipeline automation", "UX/UI", "Business process design", "API-ready architecture",
];

/** Meeting Room: the AI Automation Strategy Room, which doubles as the case study for this project. */
export function StrategyPanel() {
  const [openId, setOpenId] = useState<string>("visitor");

  return (
    <PanelShell eyebrow="Meeting Room" title="AI Automation Strategy Room" closeLabel="Close the Strategy Room">
      <div className="case-head">
        <p className="case-title">Case study: AI Headquarters</p>
        <p className="muted">Interactive AI + CRM automation environment</p>
      </div>
      <p>
        This HQ shows how one lead moves through five layers. Pick a layer to see what it is here and what it would be
        in a live build.
      </p>

      <ol className="layers">
        {LAYERS.map((layer) => {
          const open = openId === layer.id;
          return (
            <li key={layer.id} className={open ? "is-open" : ""}>
              <button type="button" className="layer-row" aria-expanded={open} onClick={() => setOpenId(layer.id)}>
                {layer.name}
              </button>
              {open && (
                <dl className="lead-facts layer-facts">
                  <div><dt>In this demo</dt><dd>{layer.here}</dd></div>
                  <div><dt>In a live build</dt><dd>{layer.live}</dd></div>
                </dl>
              )}
            </li>
          );
        })}
      </ol>

      <h3 className="panel-title panel-title-flush">Skills demonstrated</h3>
      <ul className="tag-list">{SKILLS.map((s) => <li key={s}>{s}</li>)}</ul>

      <h3 className="panel-title panel-title-flush">How it's built</h3>
      <ul className="caps-list">
        <li>Every screen reads from a service. Today the services return demo data.</li>
        <li>Real GoHighLevel, AI or n8n services can replace them without changing the interface.</li>
        <li>Secrets stay on a server. Nothing sensitive ships to the browser.</li>
        <li>High-impact actions wait for a person's approval.</li>
      </ul>
    </PanelShell>
  );
}
