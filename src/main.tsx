import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AIHeadquarters } from "./ai-hq/AIHeadquarters";
import "./ai-hq/styles/tokens.css";
import "./ai-hq/styles/hq.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AIHeadquarters />
  </StrictMode>,
);
