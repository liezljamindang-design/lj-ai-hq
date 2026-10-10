import { WORKFLOW_SEED } from "../data/workflow";
import type { WorkflowService } from "./types";

/** Demo workflow. A future ghlWorkflowService or an n8n-backed one returns the same shape. */
export const mockWorkflowService: WorkflowService = {
  async getWorkflow() {
    return structuredClone(WORKFLOW_SEED);
  },
};
