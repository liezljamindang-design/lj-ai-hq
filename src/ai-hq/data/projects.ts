import type { Project } from "../types";

/**
 * Projects shown in the Website & Funnel Studio.
 *
 * The live portfolio is a GoHighLevel custom-code page, so this list cannot be
 * read from it automatically. It is built from the CV: ten industry websites
 * with matching funnels, plus SiteHaus Studio.
 *
 * TO COMPLETE each entry, add:
 *   name        the project's real name (currently the industry)
 *   screenshot  e.g. "/projects/roofing.jpg" (put the image in /public/projects)
 *   url         the live link
 *   automation  one sentence on the automation behind it
 * Funnel types are named only where the CV makes the match clear.
 */
const site = (id: string, industry: string, funnel = "Matching lead capture funnel"): Project => ({
  id,
  name: `${industry} website and funnel`,
  industry,
  built: ["Business website", funnel],
  technology: ["GoHighLevel websites", "GoHighLevel funnels", "Forms"],
});

export const PROJECTS: Project[] = [
  site("automotive", "Automotive"),
  site("roofing", "Roofing", "Roof inspection funnel"),
  site("med-spa", "Med spa"),
  site("hvac", "HVAC"),
  site("florist", "Florist"),
  site("real-estate", "Real estate"),
  site("plumbing", "Plumbing"),
  site("landscaping", "Landscaping"),
  site("coffee-shop", "Coffee shop", "Table reservation funnel"),
  site("pet-care", "Pet care", "Pet quiz funnel"),
  {
    id: "sitehaus",
    name: "SiteHaus Studio",
    industry: "Website template store",
    built: ["Storefront", "Product listing page", "Shopping cart"],
    technology: ["GoHighLevel online store", "Products and payments"],
  },
];
