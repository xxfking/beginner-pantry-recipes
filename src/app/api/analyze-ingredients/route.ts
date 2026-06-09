import { NextResponse } from "next/server";
import { z } from "zod";
import { parseModelJson } from "@/lib/ai-json";
import { callDashScopeJson, DashScopeConfigError } from "@/lib/dashscope";
import {
  AnalyzeIngredientsRequestSchema,
  AnalyzeIngredientsResultSchema,
  IngredientSchema,
  type Ingredient,
} from "@/lib/schemas";
import { assertSafeFoodInput } from "@/lib/safety";

export const runtime = "nodejs";
export const maxDuration = 60;

const ModelAnalysisSchema = z.object({
  ingredients: z.array(IngredientSchema).min(1),
  notes: z.array(z.string().trim().min(1).max(240)).default([]),
});

function parseManualIngredients(manualText: string): Ingredient[] {
  return manualText
    .split(/[,\n;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((name) => ({
      name,
      category: "other" as const,
      confidence: 1,
      source: "manual" as const,
      needsConfirmation: false,
    }));
}

function dedupeIngredients(ingredients: Ingredient[]) {
  const seen = new Set<string>();
  const deduped: Ingredient[] = [];

  for (const ingredient of ingredients) {
    const key = ingredient.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(ingredient);
    }
  }

  return deduped;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const payload = AnalyzeIngredientsRequestSchema.parse(body);
    const manualIngredients = parseManualIngredients(payload.manualText);
    const safeManual = assertSafeFoodInput(payload.manualText);

    if (!safeManual.ok) {
      return NextResponse.json(
        {
          error: safeManual.message,
          blockedTerms: safeManual.blockedTerms,
        },
        { status: 422 },
      );
    }

    if (!payload.image) {
      if (manualIngredients.length === 0) {
        return NextResponse.json(
          { error: "Add at least one ingredient or upload a pantry photo." },
          { status: 400 },
        );
      }

      return NextResponse.json(
        AnalyzeIngredientsResultSchema.parse({
          ingredients: manualIngredients,
          notes: ["Manual ingredients were added without image analysis."],
        }),
      );
    }

    const content = await callDashScopeJson(
      [
        {
          role: "system",
          content:
            "Return compact strict JSON only. Identify edible pantry, fridge, and freezer ingredients. Exclude labels, brands, cookware, cleaners, and medicines.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Return {ingredients:[{name,category,confidence,source,needsConfirmation}],notes:[string]}. Categories: protein, vegetable, fruit, grain, dairy, pantry, seasoning, leftover, other. Mark uncertain items needsConfirmation=true. Manual text: " +
                (payload.manualText || "none"),
            },
            {
              type: "image_url",
              image_url: {
                url: payload.image.dataUrl,
              },
            },
          ],
        },
      ],
      { timeoutMs: 55_000, maxTokens: 900 },
    );

    const modelResult = parseModelJson(content, ModelAnalysisSchema);
    const ingredients = dedupeIngredients([...manualIngredients, ...modelResult.ingredients]);
    const safeModel = assertSafeFoodInput(ingredients);

    if (!safeModel.ok) {
      return NextResponse.json(
        {
          error: safeModel.message,
          blockedTerms: safeModel.blockedTerms,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      AnalyzeIngredientsResultSchema.parse({
        ingredients,
        notes: modelResult.notes,
      }),
    );
  } catch (error) {
    if (error instanceof DashScopeConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.prettifyError(error) }, { status: 400 });
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json({ error: "Ingredient analysis timed out. Try a smaller image." }, { status: 504 });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Ingredient analysis failed.",
      },
      { status: 500 },
    );
  }
}
