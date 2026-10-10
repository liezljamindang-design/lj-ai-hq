import type { Project } from "../types";

/**
 * Projects shown in the Website & Funnel Studio. These mirror the project
 * list in the LIEZL OS portfolio code (its RAW table), so when a project is
 * added there, add the same row here.
 *
 * Thumbnails come from the same screenshot service the portfolio uses. If one
 * fails to load, the card falls back to a drawn placeholder. To use your own
 * image instead, set `screenshot` to a path such as "/projects/roofing.jpg".
 */
const SITE = "https://liezljamindang.site/";
const shot = (url: string) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=900`;

// [id, name, industry, website path, funnel path, funnel label]
const RAW: [string, string, string, string, string, string][] = [
  ["blackline", "Blackline Motorworks", "Automotive", "blackline-motorworks-", "blackline-book-service-page", "Service Booking Funnel"],
  ["crestline", "Crestline Roofing Co.", "Roofing / Home Services", "crestline_roofing", "crestline-roof-inspection-page", "Roof Inspection Funnel"],
  ["faceforward", "Face Forward Med Spa and Aesthetic", "Beauty / Wellness", "face-forward-med-spa-and-aesthetic-", "faceforward-free-consultation-page", "Free Consultation Funnel"],
  ["goodair", "Good Air Co.", "HVAC", "good-air-co-", "goodair-ac-check-page", "AC Check Funnel"],
  ["flower", "Liezl's Flower Shop", "Florist / Retail", "liezl_flower_shop", "liezls-flower-help", "Flower Help Funnel"],
  ["liezmont", "LiezMont Estates", "Real Estate", "liezmont-site-", "liezmont-find-your-home", "Find Your Home Funnel"],
  ["primepipe", "PrimePipe Plumbing", "Plumbing / Home Services", "primepipe-plumbing-", "primepipe-plumbing-help-page", "Plumbing Help Funnel"],
  ["terravale", "TerraVale Landscapes", "Landscaping", "terravale-landscapes", "terravale-free-estimate-page", "Free Estimate Funnel"],
  ["veloura", "Veloura Coffee House", "Coffee / Hospitality", "veloura-coffee-house-", "veloura-reserve-page", "Reservation Funnel"],
  ["wag", "Wag & Whisker", "Pet Care", "wag--whisker-", "wagandwhisker-pet-quiz-page", "Pet Quiz Funnel"],
];

export const PROJECTS: Project[] = [
  ...RAW.map(([id, name, industry, sitePath, funnelPath, funnelLabel]): Project => ({
    id,
    name,
    industry,
    built: ["Business website", funnelLabel],
    technology: ["GoHighLevel websites", "GoHighLevel funnels", "Forms"],
    screenshot: shot(SITE + sitePath),
    url: SITE + sitePath,
    funnelUrl: SITE + funnelPath,
    funnelLabel,
  })),
  {
    id: "sitehaus",
    name: "SiteHaus Studio",
    industry: "Digital Products · Website template store",
    built: ["Storefront", "Product listing page", "Shopping cart"],
    technology: ["GoHighLevel online store", "Products and payments"],
    screenshot: shot(SITE + "home"),
    url: SITE + "home",
  },
];
