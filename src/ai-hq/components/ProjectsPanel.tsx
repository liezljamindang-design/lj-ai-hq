import { useCallback, useEffect, useState } from "react";
import { HQ_CONFIG } from "../config";
import { PROJECTS } from "../data/projects";
import { useHq } from "../store/hqStore";
import type { Project } from "../types";
import { PanelShell } from "./PanelShell";

/** A drawn stand-in for a screenshot: a small page wireframe, varied a little per project. */
function Wireframe({ index }: { index: number }) {
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

const RETRY_DELAYS = [4000, 10000, 20000];

/**
 * The project's screenshot, or the wireframe while there is none.
 * The screenshot service builds each image the first time it is asked for, so
 * a failure is usually temporary: the image is retried a few times before the
 * card settles for the wireframe.
 */
function Thumb({ project, index }: { project: Project; index: number }) {
  const [attempt, setAttempt] = useState(0);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!waiting || attempt >= RETRY_DELAYS.length) return; // out of retries: stay on the wireframe
    const timer = window.setTimeout(() => { setWaiting(false); setAttempt((n) => n + 1); }, RETRY_DELAYS[attempt]);
    return () => window.clearTimeout(timer);
  }, [waiting, attempt]);

  if (!project.screenshot || waiting) return <Wireframe index={index} />;
  return (
    <img
      key={attempt}
      className="proj-thumb"
      src={project.screenshot}
      alt=""
      loading="lazy"
      onError={() => setWaiting(true)}
    />
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
          <dl className="lead-facts">
            <div><dt>Industry</dt><dd>{project.industry}</dd></div>
            <div><dt>What I built</dt><dd>{project.built.join(", ")}</dd></div>
            <div><dt>Technology</dt><dd>{project.technology.join(", ")}</dd></div>
            {project.automation && <div><dt>Automation</dt><dd>{project.automation}</dd></div>}
          </dl>
          <div className="proj-links">
            <a className="btn-primary proj-link" href={project.url ?? HQ_CONFIG.portfolioUrl} target="_blank" rel="noopener noreferrer">
              {project.url ? "View website" : "View it in the portfolio"}
            </a>
            {project.funnelUrl && (
              <a className="btn-secondary proj-link" href={project.funnelUrl} target="_blank" rel="noopener noreferrer">
                View {project.funnelLabel ?? "funnel"}
              </a>
            )}
          </div>
          <p className="muted">Links open the live build in a new tab.</p>
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
          <a className="link-btn" href={HQ_CONFIG.portfolioPages.projects}>See all projects in the portfolio</a>
        </>
      )}
    </PanelShell>
  );
}
