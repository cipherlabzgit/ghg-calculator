import express from "express";
import cors from "cors";
import { corsOptionsFromEnv } from "./cors";
import { router } from "./routes";
import { FactorLookupError } from "./types";

export function createApp() {
  const app = express();
  app.use(cors(corsOptionsFromEnv()));
  app.use(express.json({ limit: "2mb" }));
  app.use("/api", router);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof FactorLookupError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
