import { useCallback, useEffect } from "react";
import { services } from "../services";
import { useHq } from "../store/hqStore";

/** Loads the CRM snapshot through the service layer and exposes a retry. */
export function useCrm() {
  const setCrm = useHq((s) => s.setCrm);
  const setCrmState = useHq((s) => s.setCrmState);

  const load = useCallback(() => {
    setCrmState("loading");
    services.crm
      .getSnapshot()
      .then(setCrm)
      .catch(() => setCrmState("error"));
  }, [setCrm, setCrmState]);

  useEffect(load, [load]);
  return load;
}
