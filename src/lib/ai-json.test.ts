import { describe, expect, it } from "vitest";
import { z } from "zod";
import { extractJsonObject, parseModelJson } from "@/lib/ai-json";

describe("AI JSON parsing", () => {
  it("extracts JSON from fenced content", () => {
    expect(extractJsonObject("```json\n{\"ok\":true}\n```")).toBe("{\"ok\":true}");
  });

  it("validates parsed JSON with a schema", () => {
    const schema = z.object({ ok: z.boolean() });
    expect(parseModelJson("prefix {\"ok\":true} suffix", schema)).toEqual({ ok: true });
  });

  it("throws on missing JSON", () => {
    expect(() => extractJsonObject("plain text")).toThrow();
  });
});
