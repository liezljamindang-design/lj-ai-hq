import { useCallback, useEffect } from "react";
import { services } from "../services";
import { useHq } from "../store/hqStore";

/** Loads the Live Activity feed through the service layer and exposes a retry. */
export function useActivity() {
  const setActivity = useHq((s) => s.setActivity);
  const setActivityState = useHq((s) => s.setActivityState);

  const load = useCallback(() => {
    setActivityState("loading");
    services.activity
      .getRecent()
      .then(setActivity)
      .catch(() => setActivityState("error"));
  }, [setActivity, setActivityState]);

  useEffect(load, [load]);
  return load;
}
