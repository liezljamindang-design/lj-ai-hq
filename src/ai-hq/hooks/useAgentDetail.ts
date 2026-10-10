import { useCallback, useEffect, useState } from "react";
import { services } from "../services";
import type { ActivityEntry, AgentTask } from "../types";

type State = "loading" | "ready" | "error";

/** Loads one employee's tasks and activity through the service layer. */
export function useAgentDetail(agentId: string) {
  const [state, setState] = useState<State>("loading");
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setState("loading");
    Promise.all([services.agents.getTasks(agentId), services.agents.getActivity(agentId)])
      .then(([t, a]) => {
        if (!live) return;
        setTasks(t);
        setActivity(a);
        setState("ready");
      })
      .catch(() => live && setState("error"));
    return () => { live = false; };
  }, [agentId, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, tasks, activity, retry };
}
