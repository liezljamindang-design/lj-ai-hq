import { CRM_SEED } from "../data/crm";
import type { CrmService } from "./types";

/** Demo CRM. A future ghlCRMService returns the same shape from a secure backend. */
export const mockCRMService: CrmService = {
  async getSnapshot() {
    return structuredClone(CRM_SEED);
  },
};
