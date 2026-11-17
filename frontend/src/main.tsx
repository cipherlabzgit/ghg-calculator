import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ShowFactorsProvider } from "./hooks/useShowFactors";
import { WizardDraftProvider } from "./hooks/useWizardDraft";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShowFactorsProvider>
        <WizardDraftProvider>
          <App />
        </WizardDraftProvider>
      </ShowFactorsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
