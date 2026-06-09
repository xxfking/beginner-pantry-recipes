import { z } from "zod";

export const IngredientCategorySchema = z.enum([
  "protein",
  "vegetable",
  "fruit",
  "grain",
  "dairy",
  "pantry",
  "seasoning",
  "leftover",
  "other",
]);

export const IngredientSourceSchema = z.enum(["image", "manual", "ai"]);

export const IngredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ingredient name is required")
    .max(80, "Ingredient name is too long"),
  category: IngredientCategorySchema.default("other"),
  confidence: z.number().min(0).max(1).default(1),
  source: IngredientSourceSchema.default("manual"),
  needsConfirmation: z.boolean().default(false),
});

export const ImagePayloadSchema = z.object({
  dataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|jpg|webp);base64,/i, "Use a PNG, JPG, or WebP image")
    .max(9_800_000, "Compressed image must be under 7MB"),
  mimeType: z.enum(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
  sizeBytes: z.number().int().positive().max(7 * 1024 * 1024),
});

export const AnalyzeIngredientsRequestSchema = z
  .object({
    image: ImagePayloadSchema.optional(),
    manualText: z.string().trim().max(2_000).optional().default(""),
  })
  .refine((value) => value.image || value.manualText.length > 0, {
    message: "Upload a pantry photo or enter ingredients manually.",
  });

export const AnalyzeIngredientsResultSchema = z.object({
  ingredients: z.array(IngredientSchema).min(1),
  blockedTerms: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
});

export const RecipeRequestSchema = z.object({
  ingredients: z.array(IngredientSchema).min(1, "Add at least one ingredient").max(40),
  timeLimit: z.enum(["10", "20", "30", "45"]).default("30"),
  equipment: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  diet: z.string().trim().max(80).optional().default(""),
  allergies: z.string().trim().max(160).optional().default(""),
  skillLevel: z.enum(["first-time", "beginner", "comfortable"]).default("beginner"),
  servings: z.number().int().min(1).max(8).default(2),
});

export const RecipeStepSchema = z.object({
  title: z.string().trim().min(1).max(120),
  detail: z.string().trim().min(1).max(600),
  timeMinutes: z.number().int().min(0).max(120),
  beginnerCue: z.string().trim().min(1).max(240),
});

export const RecipeResultSchema = z.object({
  title: z.string().trim().min(1).max(120),
  difficulty: z.enum(["Very easy", "Easy", "Medium"]),
  prepTime: z.string().trim().min(1).max(40),
  cookTime: z.string().trim().min(1).max(40),
  usedIngredients: z.array(z.string().trim().min(1).max(80)).min(1).max(40),
  optionalStaples: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  missingIngredients: z.array(z.string().trim().min(1).max(80)).max(5).default([]),
  steps: z.array(RecipeStepSchema).min(3).max(10),
  safetyNotes: z.array(z.string().trim().min(1).max(320)).max(10).default([]),
  substitutions: z.array(z.string().trim().min(1).max(260)).max(10).default([]),
  rescueTips: z.array(z.string().trim().min(1).max(260)).max(10).default([]),
  storageTips: z.array(z.string().trim().min(1).max(260)).max(5).default([]),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type AnalyzeIngredientsRequest = z.infer<typeof AnalyzeIngredientsRequestSchema>;
export type AnalyzeIngredientsResult = z.infer<typeof AnalyzeIngredientsResultSchema>;
export type RecipeRequest = z.infer<typeof RecipeRequestSchema>;
export type RecipeResult = z.infer<typeof RecipeResultSchema>;
