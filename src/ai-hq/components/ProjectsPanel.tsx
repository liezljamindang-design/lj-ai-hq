import { useCallback } from "react";
import { HQ_CONFIG } from "../config";
import { PROJECTS } from "../data/projects";
import { useHq } from "../store/hqStore";
import type { Project } from "../types";
import { PanelShell } from "./PanelShell";

/** A drawn stand-in for a screenshot: a small page wireframe, varied a little per project. */
function Thumb({ project, index }: { project: Project; index: number }) {
  if (project.screenshot) return <img className="proj-thumb" src={project.screenshot} alt="" loading="lazy" />;
  const v = index % 3;
  return (
    <svg className="proj-thumb" viewBox="0 0 120 76" aria-hidden="true">
      <rect className="thumb-bg" width="120" height="76" rx="5" />
      <rect className="thumb-bar" x="0" y="0" width="120" height="9" rx="5" />
      <rect className="thumb-gold" x="8" y="17" width={v === 1 ? 44 : 58} height="5" rx="2" />
      <rect className="thumb-ink" x="8" y="27" width={v === 2 ? 40 : 50} height="3" rx="1.5" />
      <rect className="thumb-ink" x="8" y="33" width="36" height="3" rx="1.5" />
      <rect className="thumb-lav" x="8" y="42" width="24" height="8" rx="4" />
      {v === 0 && <rect className="thumb-block" x="72" y="16" width="40" height="36" rx="4" />}
      {v === 1 && <circle className="thumb-block" cx="92" cy="34" r="18" />}
      {v === 2 && <><rect className="thumb-block" x="70" y="16" width="19" height="36" rx="3" /><rect className="thumb-block" x="93" y="16" width="19" height="36" rx="3" /></>}
      <rect className="thumb-block" x="8" y="58" width="32" height="12" rx="3" />
      <rect className="thumb-block" x="44" y="58" width="32" height="12" rx="3" />
      <rect className="thumb-block" x="80" y="58" width="32" height="12" rx="3" />
    </svg>
  );
}

/** Website & Funnel Studio: the portfolio projects, each opening to its details. */
export function ProjectsPanel() {
  const openId = useHq((s) => s.openProjectId);
  const setOpen = useHq((s) => s.setOpenProject);
  const index = PROJECTS.findIndex((p) => p.id === openId);
  const project = PROJECTS[index];

  const onEscape = useCallback(() => {
    if (!useHq.getState().openProjectId) return false;
    setOpen(null);
    return true;
  }, [setOpen]);

  return (
    <PanelShell
      eyebrow="Website & Funnel Studio"
      title={project ? project.name : "Projects"}
      closeLabel="Close the project showcase"
      onEscape={onEscape}
      focusKey={openId}
    >
      {project ? (
        <div className="lead-detail">
          <button type="button" className="link-btn" onClick={() => setOpen(null)}>← All projects</button>
          <Thumb project={project} index={index} />
          {!project.screenshot && <p className="muted">Illustration. A screenshot of the live build goes here.</p>}
          <dl className="lead-facts">
            <div><dt>Industry</dt><dd>{project.industry}</dd></div>
            <div><dt>What I built</dt><dd>{project.built.join(", ")}</dd></div>
            <div><dt>Technology</dt><dd>{project.technology.join(", ")}</dd></div>
            {project.automation && <div><dt>Automation</dt><dd>{project.automation}</dd></div>}
          </dl>
          <a className="btn-primary proj-link" href={project.url ?? HQ_CONFIG.portfolioUrl}>
            {project.url ? "View project" : "View it in the portfolio"}
          </a>
        </div>
      ) : (
        <>
          <p>Built in GoHighLevel: ten business websites with matching lead capture funnels, and a template store.</p>
          {PROJECTS.length === 0 ? (
            <p className="muted">No projects to show yet.</p>
          ) : (
            <ul className="proj-grid">
              {PROJECTS.map((p, i) => (
                <li key={p.id}>
                  <button type="button" className="proj-card" onClick={() => setOpen(p.id)}>
                    <Thumb project={p} index={i} />
                    <span className="proj-name">{p.name}</span>
                    <span className="proj-industry">{p.industry}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <a className="link-btn" href={HQ_CONFIG.portfolioUrl}>See them live in the portfolio</a>
        </>
      )}
    </PanelShell>
  );
}
