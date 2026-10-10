import { mockActivityService } from "./mockActivityService";
import { liveAgentService } from "./liveAgentService";
import { httpLeadService } from "./httpLeadService";
import { mockCRMService } from "./mockCRMService";
import { mockNotificationService } from "./mockNotificationService";
import { mockWorkflowService } from "./mockWorkflowService";
import type { HqServices } from "./types";

/**
 * The single place where mock services are swapped for real ones.
 * Two are real already: chat uses live AI when the server has a key (and the
 * knowledge base when it doesn't), and inquiries are delivered to Liezl.
 */
export const services: HqServices = {
  agents: liveAgentService,
  crm: mockCRMService,
  workflows: mockWorkflowService,
  activity: mockActivityService,
  notifications: mockNotificationService,
  leads: httpLeadService,
};

export type { HqServices, ActivityService, AgentService, CrmService, NotificationService, WorkflowService } from "./types";
