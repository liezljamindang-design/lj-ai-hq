import { useEffect } from "react";
import { AgentPanel } from "./components/AgentPanel";
import { BottomNav } from "./components/BottomNav";
import { AutomationPanel } from "./components/AutomationPanel";
import { CrmPanel } from "./components/CrmPanel";
import { DemoButton } from "./components/DemoButton";
import { DemoPanel } from "./components/DemoPanel";
import { ExecutivePanel } from "./components/ExecutivePanel";
import { Hud } from "./components/Hud";
import { ProjectsPanel } from "./components/ProjectsPanel";
import { StrategyPanel } from "./components/StrategyPanel";
import { Onboarding } from "./components/Onboarding";
import { HelpDialog } from "./components/HelpDialog";
import { ZoneDirectory } from "./components/ZoneDirectory";
import { FloorMap } from "./office/FloorMap";
import { useActivity } from "./hooks/useActivity";
import { useAgents } from "./hooks/useAgents";
import { useCrm } from "./hooks/useCrm";
import { useWorkflow } from "./hooks/useWorkflow";
import { useHq } from "./store/hqStore";
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="hq">
      <Hud onRetryAgents={retryAgents} />

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

        {openAgent ? (
          <AgentPanel agent={openAgent} />
        ) : dashboard === "crm" ? (
          <CrmPanel onRetry={retryCrm} />
        ) : dashboard === "automation" ? (
          <AutomationPanel onRetry={retryWorkflow} />
        ) : dashboard === "executive" ? (
          <ExecutivePanel />
        ) : dashboard === "projects" ? (
          <ProjectsPanel />
        ) : dashboard === "strategy" ? (
          <StrategyPanel />
        ) : dashboard === "demo" ? (
          <DemoPanel onRetryActivity={retryActivity} />
        ) : (
          <ZoneDirectory onRetryAgents={retryAgents} onRetryActivity={retryActivity} />
        )}
      </main>

      <BottomNav />
      <Onboarding />
      <HelpDialog />
    </div>
  );
}
