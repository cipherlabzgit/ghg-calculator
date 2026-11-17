import type { CorsOptions } from "cors";

export function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function corsOptionsFromEnv(
  raw: string | undefined = process.env.CORS_ALLOWED_ORIGINS,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): CorsOptions {
  const allowed = parseAllowedOrigins(raw);

  if (allowed.length === 0) {
    if (nodeEnv === "production") {
      console.warn(
        "CORS_ALLOWED_ORIGINS is not set. Reflecting the request Origin. Set an explicit comma-separated list in production.",
      );
    }
    return { origin: true };
  }

  return {
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  };
}
