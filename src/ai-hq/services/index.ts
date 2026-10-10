import { mockActivityService } from "./mockActivityService";
import { mockAgentService } from "./mockAgentService";
import { mockCRMService } from "./mockCRMService";
import { mockNotificationService } from "./mockNotificationService";
import { mockWorkflowService } from "./mockWorkflowService";
import type { HqServices } from "./types";

/** The single place where mock services are swapped for real ones. */
export const services: HqServices = {
  agents: mockAgentService,
  crm: mockCRMService,
  workflows: mockWorkflowService,
  activity: mockActivityService,
  notifications: mockNotificationService,
};

export type { HqServices, ActivityService, AgentService, CrmService, NotificationService, WorkflowService } from "./types";
