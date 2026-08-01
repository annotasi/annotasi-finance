import { describe, expect, it } from "vitest";

import { parseFoundationConfig } from "../src/index.js";

describe("foundation configuration", () => {
  it("accepts harmless non-secret values", () => {
    const config = parseFoundationConfig({
      APP_ENV: "test",
      PORT: "3101",
    });

    expect(config).toEqual({ APP_ENV: "test", PORT: 3101 });
  });

  it("fails clearly for an invalid port", () => {
    expect(() => parseFoundationConfig({ PORT: "not-a-port" })).toThrow();
  });
});
