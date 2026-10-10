import type { LeadService } from "./types";

/** Posts an inquiry to this site's /api/lead endpoint, which forwards it to Liezl. */
export const httpLeadService: LeadService = {
  async submit(lead) {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) {
        // Only trust a success our own endpoint wrote. A host without the server functions may answer 200 with a web page.
        const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
        return data?.ok ? "sent" : "not-configured";
      }
      // 404 covers previews of the site that are served without the server functions.
      return res.status === 503 || res.status === 404 ? "not-configured" : "failed";
    } catch {
      return "failed";
    }
  },
};
