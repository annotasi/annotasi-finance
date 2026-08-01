import { describe, expect, it } from "vitest";

import { createFoundationProbe } from "../src/index.js";

describe("test-support foundation", () => {
  it("creates neutral test-only probes", () => {
    expect(createFoundationProbe("smoke")).toEqual({
      label: "smoke",
      ready: true,
    });
  });
});
