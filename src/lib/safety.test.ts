import { describe, expect, it } from "vitest";
import { assertSafeFoodInput, getFixedSafetyNotes } from "@/lib/safety";

describe("safety rules", () => {
  it("blocks spoiled and non-food input", () => {
    const result = assertSafeFoodInput("chicken, bleach, rice");
    expect(result.ok).toBe(false);
    expect(result.blockedTerms).toContain("bleach");
  });

  it("adds poultry and leftover safety notes", () => {
    const notes = getFixedSafetyNotes([
      {
        name: "leftover rice",
        category: "leftover",
        confidence: 1,
        source: "manual",
        needsConfirmation: false,
      },
      {
        name: "chicken",
        category: "protein",
        confidence: 1,
        source: "manual",
        needsConfirmation: false,
      },
    ]);

    expect(notes.join(" ")).toContain("165 degrees F");
    expect(notes.join(" ")).toContain("Refrigerate leftovers within 2 hours");
  });
});
