import { describe, expect, it } from "vitest";

import { readinessResponseSchema } from "../src/index.js";

describe("readiness response contract", () => {
  it("accepts the neutral API readiness shape", () => {
    const result = readinessResponseSchema.parse({
      service: "annotasi-finance-api",
      status: "ready",
    });

    expect(result.status).toBe("ready");
  });

  it("rejects an unknown readiness status", () => {
    expect(() =>
      readinessResponseSchema.parse({
        service: "annotasi-finance-api",
        status: "unknown",
      }),
    ).toThrow();
  });
});
