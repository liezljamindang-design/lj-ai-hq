import { ACTIVITY_SEED } from "../data/activity";
import type { ActivityService } from "./types";

export const clockTime = (date = new Date()) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** Demo feed. A future version would stream real events from the backend. */
export const mockActivityService: ActivityService = {
  async getRecent() {
    const now = Date.now();
    return ACTIVITY_SEED.map((e, i) => ({
      id: `seed-${i}`,
      time: clockTime(new Date(now - e.minutesAgo * 60_000)),
      text: e.text,
    }));
  },
};
