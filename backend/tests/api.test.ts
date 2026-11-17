import request from "supertest";
import { createApp } from "../src/app";
import { emptyRequest } from "./helpers";

const app = createApp();

describe("API", () => {
  it("returns health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, version: "02.6" });
  });

  it("returns countries and factor trees", async () => {
    const countries = await request(app).get("/api/countries");
    expect(countries.status).toBe(200);
    expect(countries.body.length).toBeGreaterThan(200);

    const factors = await request(app).get("/api/factors?category=fuels");
    expect(factors.status).toBe(200);
    expect(Array.isArray(factors.body.tree)).toBe(true);

    const meta = await request(app).get("/api/meta");
    expect(meta.status).toBe(200);
    expect(meta.body.ukElectricityKgPerKwh).toBeCloseTo(0.21233, 5);
    expect(meta.body.tdElectricityKgPerKwh).toBeCloseTo(0.01879, 5);

    const waste = await request(app).get("/api/factors?category=waste");
    const processes = new Set(waste.body.tree.map((row: { process: string }) => row.process));
    expect(processes.has("Landfill")).toBe(true);
    expect(processes.has("Closed-loop")).toBe(true);

    const vehicles = await request(app).get("/api/factors?category=ownedVehicles");
    const phev = vehicles.body.tree.find(
      (row: { fuel: string; level3: string }) =>
        row.fuel === "Plug-in Hybrid Electric Vehicle" && row.level3 === "Small car",
    );
    expect(phev?.evFactor).toBeGreaterThan(0);
  });

  it("calculates a valid payload", async () => {
    const response = await request(app)
      .post("/api/calculate")
      .send(
        emptyRequest({
          scope1: {
            fuels: [{ type: "Gaseous fuels", fuel: "CNG", unit: "litres", amount: 1000 }],
            bioenergy: [],
            refrigerants: [],
            ownedVehicles: [],
          },
        }),
      );
    expect(response.status).toBe(200);
    expect(response.body.scope1tCO2e).toBeCloseTo(0.44423, 5);
  });

  it("rejects an invalid payload", async () => {
    const response = await request(app).post("/api/calculate").send({ organisation: {} });
    expect(response.status).toBe(400);
  });

  it("returns 400 when a factor key is missing", async () => {
    const response = await request(app)
      .post("/api/calculate")
      .send(
        emptyRequest({
          scope1: {
            fuels: [{ type: "Gaseous fuels", fuel: "Unobtainium", unit: "litres", amount: 1 }],
            bioenergy: [],
            refrigerants: [],
            ownedVehicles: [],
          },
        }),
      );
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/emission factor/i);
  });
});
