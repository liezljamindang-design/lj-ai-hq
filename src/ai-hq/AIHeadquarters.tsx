import { useEffect } from "react";
import { AgentPanel } from "./components/AgentPanel";
import { Hud } from "./components/Hud";
import { Onboarding } from "./components/Onboarding";
import { HelpDialog } from "./components/HelpDialog";
import { ZoneDirectory } from "./components/ZoneDirectory";
import { FloorMap } from "./office/FloorMap";
import { useAgents } from "./hooks/useAgents";
import { useHq } from "./store/hqStore";
import { HQ_CONFIG } from "./config";

/** Root of the AI Headquarters experience. Everything public here runs on demo data. */
export function AIHeadquarters() {
  const theme = useHq((s) => s.theme);
  const retryAgents = useAgents();
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
            <p className="eyebrow">Portfolio demo</p>
            <h1 id="hq-title">AI employees working inside an automated CRM</h1>
            <p className="hq-lede">
              Built by {HQ_CONFIG.ownerName}, {HQ_CONFIG.ownerTitle}. Walk in with WASD or the arrow keys, or tap the floor. Tap an AI employee to meet them.
            </p>
          </header>
          <FloorMap />
        </section>

        {openAgent ? <AgentPanel agent={openAgent} /> : <ZoneDirectory onRetryAgents={retryAgents} />}
      </main>

      <Onboarding />
      <HelpDialog />
    </div>
  );
}
