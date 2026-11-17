import request from "supertest";
import { createApp } from "../src/app";
import { parseAllowedOrigins } from "../src/cors";

describe("CORS_ALLOWED_ORIGINS", () => {
  const original = process.env.CORS_ALLOWED_ORIGINS;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.CORS_ALLOWED_ORIGINS;
    } else {
      process.env.CORS_ALLOWED_ORIGINS = original;
    }
  });

  it("parses a comma-separated origin list", () => {
    expect(parseAllowedOrigins("https://app.example.com, http://localhost:5173")).toEqual([
      "https://app.example.com",
      "http://localhost:5173",
    ]);
  });

  it("reflects the request origin when the allow-list is unset (local development)", async () => {
    delete process.env.CORS_ALLOWED_ORIGINS;
    const app = createApp();
    const response = await request(app).get("/api/health").set("Origin", "http://localhost:5173");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("allows a listed origin", async () => {
    process.env.CORS_ALLOWED_ORIGINS = "https://app.example.com,http://localhost:5173";
    const app = createApp();
    const response = await request(app).get("/api/health").set("Origin", "https://app.example.com");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("https://app.example.com");
  });

  it("does not echo an origin that is not listed", async () => {
    process.env.CORS_ALLOWED_ORIGINS = "https://app.example.com";
    const app = createApp();
    const response = await request(app).get("/api/health").set("Origin", "https://evil.example.com");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
