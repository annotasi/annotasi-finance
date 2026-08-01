import { describe, expect, it } from "vitest";

import { DOMAIN_FOUNDATION_STATUS } from "../src/index.js";

describe("domain foundation", () => {
  it("remains explicitly framework-independent", () => {
    expect(DOMAIN_FOUNDATION_STATUS).toBe("framework-independent");
  });
});
