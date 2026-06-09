import { describe, expect, it } from "vitest";
import { seoPages } from "@/lib/seo-pages";
import { buildSeoPageJsonLd } from "@/lib/structured-data";

describe("SEO pages", () => {
  it("defines exactly 20 long-tail pages", () => {
    expect(seoPages).toHaveLength(20);
  });

  it("uses unique paths, titles, and descriptions", () => {
    expect(new Set(seoPages.map((page) => page.path)).size).toBe(20);
    expect(new Set(seoPages.map((page) => page.title)).size).toBe(20);
    expect(new Set(seoPages.map((page) => page.description)).size).toBe(20);
  });

  it("builds Recipe, HowTo, ItemList, and FAQ JSON-LD", () => {
    const jsonLd = buildSeoPageJsonLd(seoPages[0]);
    expect(jsonLd.map((item) => item["@type"])).toEqual(["Recipe", "HowTo", "ItemList", "FAQPage"]);
  });
});
