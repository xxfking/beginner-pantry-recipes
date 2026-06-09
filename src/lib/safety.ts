import type { Ingredient, RecipeRequest } from "@/lib/schemas";

const blockedFoodTerms = [
  "bleach",
  "detergent",
  "dish soap",
  "cleaner",
  "cleaning spray",
  "medicine",
  "pill",
  "tablet",
  "mold",
  "mould",
  "spoiled",
  "rotten",
  "expired",
  "smells bad",
  "rancid",
];

const poultryTerms = ["chicken", "turkey", "duck", "poultry"];
const groundMeatTerms = ["ground beef", "minced beef", "ground pork", "ground turkey", "ground chicken"];
const fishTerms = ["fish", "salmon", "tuna", "shrimp", "prawn", "scallop", "cod", "tilapia"];
const eggTerms = ["egg", "eggs"];
const leftoverTerms = ["leftover", "leftovers", "cooked rice", "cooked pasta"];

export function normalizeFoodText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function findBlockedTerms(input: string | Ingredient[]) {
  const text = Array.isArray(input)
    ? input.map((ingredient) => ingredient.name).join(" ")
    : input;
  const normalized = normalizeFoodText(text);

  return blockedFoodTerms.filter((term) => normalized.includes(term));
}

export function assertSafeFoodInput(input: string | Ingredient[]) {
  const blockedTerms = findBlockedTerms(input);

  if (blockedTerms.length > 0) {
    return {
      ok: false as const,
      blockedTerms,
      message:
        "Remove unsafe or spoiled items before generating a recipe. This tool only works with edible ingredients that are fresh enough to cook.",
    };
  }

  return { ok: true as const, blockedTerms: [] as string[] };
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function getFixedSafetyNotes(ingredients: Ingredient[]) {
  const normalized = normalizeFoodText(ingredients.map((ingredient) => ingredient.name).join(" "));
  const notes = new Set<string>();

  if (includesAny(normalized, poultryTerms)) {
    notes.add("Cook poultry to 165 degrees F and check the thickest part before serving.");
  }

  if (includesAny(normalized, groundMeatTerms)) {
    notes.add("Cook ground meat to 160 degrees F and break it apart so there are no pink centers.");
  }

  if (includesAny(normalized, fishTerms)) {
    notes.add("Cook fish and shellfish to 145 degrees F, or until the flesh is opaque and flakes easily.");
  }

  if (includesAny(normalized, eggTerms)) {
    notes.add("Cook eggs until the yolk and white are firm unless you are using pasteurized eggs.");
  }

  if (includesAny(normalized, leftoverTerms)) {
    notes.add("Reheat leftovers to 165 degrees F and keep hot food out of the danger zone.");
  }

  notes.add(
    "Refrigerate leftovers within 2 hours, keep the fridge at 40 degrees F or below, and keep the freezer at 0 degrees F.",
  );

  return Array.from(notes);
}

export function sanitizeRecipeRequestForPrompt(request: RecipeRequest) {
  return {
    ingredients: request.ingredients.map((ingredient) => ingredient.name),
    timeLimitMinutes: Number(request.timeLimit),
    equipment: request.equipment,
    diet: request.diet || "none",
    allergies: request.allergies || "none",
    skillLevel: request.skillLevel,
    servings: request.servings,
  };
}
