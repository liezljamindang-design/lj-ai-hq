import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AIHeadquarters } from "./ai-hq/AIHeadquarters";
import { ErrorBoundary } from "./ai-hq/components/ErrorBoundary";
import "./ai-hq/styles/tokens.css";
import "./ai-hq/styles/hq.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AIHeadquarters />
    </ErrorBoundary>
  </StrictMode>,
);
