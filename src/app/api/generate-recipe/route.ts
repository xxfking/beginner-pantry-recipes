import { NextResponse } from "next/server";
import { z } from "zod";
import { parseModelJson } from "@/lib/ai-json";
import { callDashScopeJson, DashScopeConfigError } from "@/lib/dashscope";
import { RecipeRequestSchema, RecipeResultSchema } from "@/lib/schemas";
import {
  assertSafeFoodInput,
  getFixedSafetyNotes,
  sanitizeRecipeRequestForPrompt,
} from "@/lib/safety";

export const runtime = "nodejs";
export const maxDuration = 30;

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const payload = RecipeRequestSchema.parse(body);
    const safe = assertSafeFoodInput(payload.ingredients);

    if (!safe.ok) {
      return NextResponse.json(
        {
          error: safe.message,
          blockedTerms: safe.blockedTerms,
        },
        { status: 422 },
      );
    }

    const fixedSafetyNotes = getFixedSafetyNotes(payload.ingredients);
    const content = await callDashScopeJson([
      {
        role: "system",
        content:
          "You are a food safety conscious recipe assistant for beginner home cooks. Return strict JSON only. Never invent unsafe shortcuts. Give concrete visual cues and rescue tips.",
      },
      {
        role: "user",
        content: JSON.stringify({
          task:
            "Create one beginner-friendly recipe using mostly the confirmed ingredients. Keep it practical for a nervous beginner. Use the exact JSON fields requested.",
          requiredJsonShape: {
            title: "string",
            difficulty: "Very easy | Easy | Medium",
            prepTime: "string",
            cookTime: "string",
            usedIngredients: ["string"],
            optionalStaples: ["string"],
            missingIngredients: ["string"],
            steps: [
              {
                title: "string",
                detail: "string",
                timeMinutes: 0,
                beginnerCue: "string",
              },
            ],
            safetyNotes: ["string"],
            substitutions: ["string"],
            rescueTips: ["string"],
            storageTips: ["string"],
          },
          request: sanitizeRecipeRequestForPrompt(payload),
          mandatorySafetyNotes: fixedSafetyNotes,
          rules: [
            "Use 3 to 8 steps.",
            "Missing ingredients must be optional and limited to five items.",
            "Avoid advanced cooking terms unless immediately explained.",
            "Mention food safety for poultry, ground meat, fish, eggs, leftovers, and refrigeration when relevant.",
            "All times must fit the selected time limit as closely as possible.",
          ],
        }),
      },
    ]);

    const recipe = RecipeResultSchema.parse(parseModelJson(content, RecipeResultSchema));

    return NextResponse.json({
      ...recipe,
      safetyNotes: uniqueStrings([...fixedSafetyNotes, ...recipe.safetyNotes]),
    });
  } catch (error) {
    if (error instanceof DashScopeConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.prettifyError(error) }, { status: 400 });
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json({ error: "Recipe generation timed out. Try fewer ingredients." }, { status: 504 });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Recipe generation failed.",
      },
      { status: 500 },
    );
  }
}
