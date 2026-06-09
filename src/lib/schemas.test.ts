import { describe, expect, it } from "vitest";
import {
  AnalyzeIngredientsRequestSchema,
  RecipeRequestSchema,
  RecipeResultSchema,
} from "@/lib/schemas";

describe("schemas", () => {
  it("rejects empty ingredient analysis requests", () => {
    expect(() => AnalyzeIngredientsRequestSchema.parse({ manualText: "" })).toThrow();
  });

  it("rejects overlong ingredient names", () => {
    expect(() =>
      RecipeRequestSchema.parse({
        ingredients: [
          {
            name: "x".repeat(81),
            category: "other",
            confidence: 1,
            source: "manual",
            needsConfirmation: false,
          },
        ],
      }),
    ).toThrow();
  });

  it("accepts a complete recipe result", () => {
    const result = RecipeResultSchema.parse({
      title: "Egg Rice Bowl",
      difficulty: "Easy",
      prepTime: "5 minutes",
      cookTime: "10 minutes",
      usedIngredients: ["rice", "egg"],
      optionalStaples: ["soy sauce"],
      missingIngredients: [],
      steps: [
        {
          title: "Warm rice",
          detail: "Heat the rice until steaming.",
          timeMinutes: 3,
          beginnerCue: "Steam should rise from the bowl.",
        },
        {
          title: "Cook egg",
          detail: "Scramble the egg in a skillet.",
          timeMinutes: 4,
          beginnerCue: "The egg should look set.",
        },
        {
          title: "Combine",
          detail: "Fold the egg into the rice.",
          timeMinutes: 2,
          beginnerCue: "The grains should be coated.",
        },
      ],
      safetyNotes: ["Reheat leftovers to 165 degrees F."],
      substitutions: ["Use tofu instead of egg."],
      rescueTips: ["Add water if rice is dry."],
      storageTips: ["Refrigerate within 2 hours."],
    });

    expect(result.title).toBe("Egg Rice Bowl");
  });
});
