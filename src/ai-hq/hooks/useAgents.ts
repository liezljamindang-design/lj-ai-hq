import { useCallback, useEffect } from "react";
import { services } from "../services";
import { useHq } from "../store/hqStore";

/** Loads the AI employees through the service layer and exposes a retry. */
export function useAgents() {
  const setAgents = useHq((s) => s.setAgents);
  const setAgentsState = useHq((s) => s.setAgentsState);

  const load = useCallback(() => {
    setAgentsState("loading");
    services.agents
      .listAgents()
      .then(setAgents)
      .catch(() => setAgentsState("error"));
  }, [setAgents, setAgentsState]);

  useEffect(load, [load]);
  return load;
}
