import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage, { foundationPageCopy } from "../app/page";

describe("web foundation page", () => {
  it("renders the neutral Indonesian technical status", () => {
    const html = renderToStaticMarkup(HomePage());

    expect(html).toContain(foundationPageCopy.heading);
    expect(html).toContain(foundationPageCopy.statusValue);
    expect(html).not.toContain("dashboard");
  });
});
