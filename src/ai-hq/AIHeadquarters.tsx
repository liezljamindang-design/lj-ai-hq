import { useEffect, useRef } from "react";
import { BottomNav } from "./components/BottomNav";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DemoButton } from "./components/DemoButton";
import { Hud } from "./components/Hud";
import { Onboarding } from "./components/Onboarding";
import { HelpDialog } from "./components/HelpDialog";
import { ZoneDirectory } from "./components/ZoneDirectory";
import { FloorMap } from "./office/FloorMap";
import { useActivity } from "./hooks/useActivity";
import { useAgents } from "./hooks/useAgents";
import { useCrm } from "./hooks/useCrm";
import { useWorkflow } from "./hooks/useWorkflow";
import { useHq } from "./store/hqStore";
import { useOnline } from "./hooks/useOnline";
import { usePanel, warmPanels } from "./hooks/usePanel";
import { HQ_CONFIG } from "./config";

/** Root of the AI Headquarters experience. Everything public here runs on demo data. */
export function AIHeadquarters() {
  const theme = useHq((s) => s.theme);
  const retryAgents = useAgents();
  const retryCrm = useCrm();
  const retryWorkflow = useWorkflow();
  const retryActivity = useActivity();
  const dashboard = useHq((s) => s.openDashboard);
  const openAgent = useHq((s) => s.agents.find((a) => a.id === s.openAgentId));

  const online = useOnline();
  // Each panel is a separate chunk, fetched on first use or in the background once the office is up.
  const panelName = openAgent ? "agent" : dashboard;
  const { Panel, retry: retryPanel } = usePanel(panelName);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(warmPanels);
    return () => cancel(handle);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // When a panel closes, hand keyboard focus back to the directory instead of losing it.
  const panelOpen = !!openAgent || !!dashboard;
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !panelOpen) document.getElementById("hq-directory")?.focus({ preventScroll: true });
    wasOpen.current = panelOpen;
  }, [panelOpen]);

  const skipToSide = () => document.querySelector<HTMLElement>("#hq-directory, .side-panel")?.focus();

  return (
    <div className="hq">
      <button type="button" className="skip-link" onClick={skipToSide}>Skip the office and go to the directory</button>
      <Hud onRetryAgents={retryAgents} />

      {!online && (
        <p className="offline-note" role="status">
          You're offline. The demo keeps working, but links to the portfolio and the music fonts may not load.
        </p>
      )}

      <main className="hq-main">
        <section className="hq-stage" aria-labelledby="hq-title">
          <header className="hq-intro">
            <div className="hq-intro-copy">
              <p className="eyebrow">Portfolio demo</p>
              <h1 id="hq-title">AI employees working inside an automated CRM</h1>
              <p className="hq-lede">
                Built by {HQ_CONFIG.ownerName}, {HQ_CONFIG.ownerTitle}.{" "}
                <span className="only-desktop">Walk in with WASD or the arrow keys, or click the floor. Click an AI employee to meet them.</span>
                <span className="only-mobile">Tap the floor to walk. Tap an AI employee to meet them.</span>
              </p>
            </div>
            <DemoButton />
          </header>
          <FloorMap />
        </section>

        <ErrorBoundary compact>
          {Panel === null ? (
            <ZoneDirectory onRetryAgents={retryAgents} onRetryActivity={retryActivity} />
          ) : Panel === "loading" ? (
            <aside className="side-panel" aria-busy="true"><p className="muted">Loading…</p></aside>
          ) : Panel === "error" ? (
            <aside className="side-panel">
              <p className="muted">
                This panel didn't load. Check your connection.{" "}
                <button type="button" className="link-btn" onClick={retryPanel}>Try again</button>
              </p>
            </aside>
          ) : panelName === "agent" ? (
            <Panel agent={openAgent} />
          ) : panelName === "crm" ? (
            <Panel onRetry={retryCrm} />
          ) : panelName === "automation" ? (
            <Panel onRetry={retryWorkflow} />
          ) : panelName === "demo" ? (
            <Panel onRetryActivity={retryActivity} />
          ) : (
            <Panel />
          )}
        </ErrorBoundary>
      </main>

      <BottomNav />
      <Onboarding />
      <HelpDialog />
    </div>
  );
}
