/** Public, browser-safe settings. Secrets never belong in this file. */
const portfolio =
  (import.meta.env.VITE_PORTFOLIO_URL as string | undefined) ??
  "https://portfolio.liezljamindang.site";

export const HQ_CONFIG = {
  ownerName: "Liezl Jamindang",
  ownerTitle: "GoHighLevel Specialist",
  ownerTagline: "CRM • Automation • AI Systems",
  portfolioUrl: portfolio,
  cvPath: "/Liezl_Jamindang_GoHighLevel_Specialist_CV.pdf",
  email: "liezljamindang@gmail.com",
  phone: "+63 961 243 6318",
  location: "Philippines · Remote",
  /** "demo" is the only mode in V1. "admin" is reserved for a future private build. */
  mode: "demo" as HqMode,
};

export type HqMode = "demo" | "admin";
