import { useCallback, useEffect } from "react";
import { services } from "../services";
import { useHq } from "../store/hqStore";

/** Loads the Automation Lab workflow through the service layer and exposes a retry. */
export function useWorkflow() {
  const setWorkflow = useHq((s) => s.setWorkflow);
  const setWorkflowState = useHq((s) => s.setWorkflowState);

  const load = useCallback(() => {
    setWorkflowState("loading");
    services.workflows
      .getWorkflow()
      .then(setWorkflow)
      .catch(() => setWorkflowState("error"));
  }, [setWorkflow, setWorkflowState]);

  useEffect(load, [load]);
  return load;
}
