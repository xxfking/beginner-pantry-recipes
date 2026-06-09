"use client";

import NextImage from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Utensils,
  X,
} from "lucide-react";
import type { Ingredient, RecipeResult } from "@/lib/schemas";

type ImagePayload = {
  dataUrl: string;
  mimeType: "image/jpeg";
  sizeBytes: number;
};

type RecipeToolProps = {
  seedIngredients?: string[];
  pageIntent?: string;
};

const maxImageBytes = 7 * 1024 * 1024;

const equipmentOptions = ["skillet", "saucepan", "microwave", "rice cooker", "air fryer", "sheet pan"];
const dietOptions = ["", "vegetarian", "dairy-free", "gluten-free", "high-protein"];
const skillOptions = [
  { value: "first-time", label: "First-time" },
  { value: "beginner", label: "Beginner" },
  { value: "comfortable", label: "Comfortable" },
] as const;

function ingredientFromName(name: string): Ingredient {
  return {
    name,
    category: "other",
    confidence: 1,
    source: "manual",
    needsConfirmation: false,
  };
}

async function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read compressed image."));
    reader.readAsDataURL(blob);
  });
}

async function compressImage(file: File): Promise<ImagePayload> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Upload a PNG, JPG, or WebP image.");
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not load that image."));
      image.src = objectUrl;
    });

    const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Image compression is unavailable in this browser.");
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (nextBlob) => {
          if (nextBlob) {
            resolve(nextBlob);
          } else {
            reject(new Error("Could not compress that image."));
          }
        },
        "image/jpeg",
        0.82,
      );
    });

    if (blob.size > maxImageBytes) {
      throw new Error("Compressed image is still over 7MB. Try a smaller photo.");
    }

    return {
      dataUrl: await readBlobAsDataUrl(blob),
      mimeType: "image/jpeg",
      sizeBytes: blob.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function joinIngredients(ingredients: Ingredient[]) {
  return ingredients.map((ingredient) => ingredient.name).join(", ");
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload as T;
}

export function RecipeTool({ seedIngredients = [], pageIntent }: RecipeToolProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialIngredients = useMemo(() => seedIngredients.map(ingredientFromName), [seedIngredients]);
  const [manualText, setManualText] = useState(seedIngredients.join(", "));
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [imagePayload, setImagePayload] = useState<ImagePayload | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState("");
  const [timeLimit, setTimeLimit] = useState<"10" | "20" | "30" | "45">("30");
  const [equipment, setEquipment] = useState<string[]>(["skillet"]);
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState("");
  const [skillLevel, setSkillLevel] = useState<"first-time" | "beginner" | "comfortable">("beginner");
  const [servings, setServings] = useState(2);
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleFile(file: File) {
    setError("");
    const compressed = await compressImage(file);
    setImagePayload(compressed);
    setImagePreview(compressed.dataUrl);
  }

  async function handleAnalyze() {
    setError("");
    setIsAnalyzing(true);
    try {
      const payload = await postJson<{ ingredients: Ingredient[]; notes: string[] }>(
        "/api/analyze-ingredients",
        {
          image: imagePayload || undefined,
          manualText,
        },
      );
      setIngredients(payload.ingredients);
      setNotes(payload.notes || []);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Ingredient analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleGenerate() {
    setError("");
    setResult(null);
    setIsGenerating(true);
    try {
      const recipe = await postJson<RecipeResult>("/api/generate-recipe", {
        ingredients,
        timeLimit,
        equipment,
        diet,
        allergies,
        skillLevel,
        servings,
      });
      setResult(recipe);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Recipe generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  function addIngredient() {
    const name = newIngredient.trim();
    if (!name) {
      return;
    }

    setIngredients((current) => [...current, ingredientFromName(name)]);
    setManualText((current) => (current.trim() ? `${current}, ${name}` : name));
    setNewIngredient("");
  }

  function removeIngredient(index: number) {
    setIngredients((current) => current.filter((_, ingredientIndex) => ingredientIndex !== index));
  }

  function toggleEquipment(item: string) {
    setEquipment((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  function loadSample() {
    const sample = ["leftover rice", "eggs", "frozen peas", "soy sauce", "green onions"].map(
      ingredientFromName,
    );
    setIngredients(sample);
    setManualText(joinIngredients(sample));
    setResult(null);
    setNotes(["Sample pantry loaded. Edit the list before generating a recipe."]);
  }

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8" aria-label="Recipe generator">
      <div className="mb-6 hidden gap-4 lg:grid lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="hidden lg:block" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[112px_132px_148px_300px_92px_190px] lg:items-end">
          <label className="control-label">
            Time
            <select
              value={timeLimit}
              onChange={(event) => setTimeLimit(event.target.value as "10" | "20" | "30" | "45")}
              className="field-base mt-2 h-11 w-full px-3 text-sm font-semibold"
            >
              {(["10", "20", "30", "45"] as const).map((value) => (
                <option key={value} value={value}>
                  {value} min
                </option>
              ))}
            </select>
          </label>
          <label className="control-label">
            Equipment
            <select
              value={equipment[0] || ""}
              onChange={(event) => setEquipment(event.target.value ? [event.target.value] : [])}
              className="field-base mt-2 h-11 w-full px-3 text-sm font-semibold capitalize"
            >
              {equipmentOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="control-label">
            Diet
            <select
              value={diet}
              onChange={(event) => setDiet(event.target.value)}
              className="field-base mt-2 h-11 w-full px-3 text-sm font-semibold"
            >
              <option value="">No preference</option>
              {dietOptions.filter(Boolean).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="control-label">Skill level</span>
            <div className="mt-2 grid h-11 grid-cols-3 border border-[color:var(--border-soft)]">
              {skillOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setSkillLevel(option.value)}
                  className={
                    skillLevel === option.value
                      ? "bg-[color:var(--swedish-blue)] text-xs font-semibold text-white"
                      : "border-l border-[color:var(--border-soft)] bg-[color:var(--surface)] text-xs font-semibold text-black first:border-l-0"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="control-label">
            Servings
            <input
              type="number"
              min={1}
              max={8}
              value={servings}
              onChange={(event) => setServings(Number(event.target.value))}
              className="field-base mt-2 h-11 w-full px-3 text-sm font-semibold"
            />
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={ingredients.length === 0 || isGenerating}
            className="primary-button h-11 bg-[color:var(--action-red)] hover:bg-[#a81927] disabled:cursor-not-allowed disabled:bg-[#b9b3aa]"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate beginner recipe
          </button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr_1.15fr]">
        <div className="surface-panel p-5 lg:border-r-0">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span className="panel-number">01</span>
              <div>
                <h2 className="panel-kicker">Upload pantry photo</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Confirm the edible ingredients before generating a recipe.
                </p>
              </div>
            </div>
            <Camera className="h-5 w-5 text-[color:var(--swedish-blue)]" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="pantry-photo relative block min-h-[248px] w-full overflow-hidden text-center"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Compressed pantry upload preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <NextImage
                  src="/pantry-still-life.webp"
                  alt="Rice, eggs, carrots, herbs, garlic, and oats on a light table"
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover"
                  priority
                />
                <span className="pantry-photo-overlay">
                  <span className="upload-tile transition hover:border-[color:var(--swedish-blue)] hover:text-[color:var(--swedish-blue)]">
                    <Upload className="h-5 w-5" aria-hidden="true" />
                    Add photo
                  </span>
                </span>
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs font-medium text-[color:var(--muted)]">
            PNG, JPG, or WebP up to 7MB after compression
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              try {
                await handleFile(file);
              } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : "Image upload failed.");
              }
            }}
          />

          <label className="mt-5 block text-xs font-semibold uppercase text-[color:var(--muted)]" htmlFor="manual-ingredients">
            Add ingredients
          </label>
          <textarea
            id="manual-ingredients"
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            rows={4}
            className="field-base mt-2 w-full px-3 py-3 text-sm leading-6"
            placeholder="chicken, rice, eggs, frozen peas"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="primary-button bg-[color:var(--swedish-blue)] hover:bg-[color:var(--swedish-blue-2)]"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyze ingredients
            </button>
            <button type="button" onClick={loadSample} className="secondary-button">
              Use sample pantry
            </button>
          </div>

          {notes.length > 0 ? (
            <div className="mt-4 border border-[color:var(--safety-green)] bg-[#edf6ef] px-3 py-3 text-sm text-[#174b30]">
              {notes[0]}
            </div>
          ) : null}
        </div>

        <div className="surface-panel p-5 lg:border-r-0">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span className="panel-number">02</span>
              <div>
                <h2 className="panel-kicker">Confirm ingredients</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Remove uncertain items and add missing pantry staples.
                </p>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-[color:var(--safety-green)]" aria-hidden="true" />
          </div>

          <div className="flex gap-2">
            <input
              value={newIngredient}
              onChange={(event) => setNewIngredient(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addIngredient();
                }
              }}
              className="field-base min-w-0 flex-1 px-3 py-2 text-sm"
              placeholder="Add one item"
            />
            <button type="button" onClick={addIngredient} className="icon-button" aria-label="Add ingredient">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex max-h-72 flex-col gap-2 overflow-auto pr-1">
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <div
                  key={`${ingredient.name}-${index}`}
                  className="grid grid-cols-[18px_1fr_auto_auto] items-center gap-3 border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-3 py-2"
                >
                  <span className="h-3.5 w-3.5 border border-[color:var(--swedish-blue)] bg-[color:var(--swedish-blue)]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-black">{ingredient.name}</p>
                    <p className="text-xs text-[color:var(--muted)]">
                      {ingredient.source} | {ingredient.category}
                      {ingredient.needsConfirmation ? " | confirm" : ""}
                    </p>
                  </div>
                  <span className="confidence-pill">{Math.round(ingredient.confidence * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-[color:var(--muted)] transition hover:bg-[#f8e9e9] hover:text-[color:var(--action-red)]"
                    aria-label={`Remove ${ingredient.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] px-3 py-6 text-center text-sm text-[color:var(--muted)]">
                Add ingredients or analyze a photo.
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4 border-t border-[color:var(--border-soft)] pt-5">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
                <Clock3 className="h-4 w-4 text-[color:var(--swedish-blue)]" />
                Time limit
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["10", "20", "30", "45"] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setTimeLimit(value)}
                    className={timeLimit === value ? "choice-button-active" : "choice-button"}
                  >
                    {value}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
                <Utensils className="h-4 w-4 text-[color:var(--swedish-blue)]" />
                Equipment
              </div>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleEquipment(item)}
                    className={equipment.includes(item) ? "tag-active" : "tag"}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-black">
                Diet
                <select
                  value={diet}
                  onChange={(event) => setDiet(event.target.value)}
                  className="field-base mt-2 w-full px-3 py-2 text-sm font-normal"
                >
                  <option value="">No diet filter</option>
                  {dietOptions.filter(Boolean).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-black">
                Servings
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={servings}
                  onChange={(event) => setServings(Number(event.target.value))}
                  className="field-base mt-2 w-full px-3 py-2 text-sm font-normal"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-black">
              Allergies
              <input
                value={allergies}
                onChange={(event) => setAllergies(event.target.value)}
                className="field-base mt-2 w-full px-3 py-2 text-sm font-normal"
                placeholder="peanuts, shellfish, dairy"
              />
            </label>

            <div className="grid grid-cols-3 gap-2">
              {skillOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setSkillLevel(option.value)}
                  className={skillLevel === option.value ? "choice-button-active" : "choice-button"}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-panel p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span className="panel-number">03</span>
              <div>
                <h2 className="panel-kicker">Step-by-step recipe</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Built for simple moves, clear cues, and food safety.
                </p>
              </div>
            </div>
            <ShieldCheck className="h-5 w-5 text-[color:var(--safety-green)]" aria-hidden="true" />
          </div>

          {pageIntent ? (
            <div className="mb-4 border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] px-3 py-3 text-sm text-[color:var(--muted)]">
              {pageIntent}
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 flex items-start gap-2 border border-[color:var(--action-red)] bg-[#fff1f0] px-3 py-3 text-sm text-[color:var(--action-red)]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
              <button
                type="button"
                className="ml-auto p-0.5 text-[color:var(--action-red)] hover:bg-[#f8e9e9]"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={ingredients.length === 0 || isGenerating}
            className="primary-button w-full bg-[color:var(--action-red)] hover:bg-[#a81927] disabled:cursor-not-allowed disabled:bg-[#b9b3aa]"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate beginner recipe
          </button>

          {result ? (
            <article className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase text-[color:var(--swedish-blue)]">
                  {result.difficulty} | {result.prepTime} prep | {result.cookTime} cook
                </p>
                <h3 className="mt-2 font-display text-3xl font-medium leading-tight text-black">
                  {result.title}
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3">
                  <p className="text-sm font-semibold text-black">Used ingredients</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{result.usedIngredients.join(", ")}</p>
                </div>
                <div className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3">
                  <p className="text-sm font-semibold text-black">Missing one ingredient</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                    {result.missingIngredients.length ? result.missingIngredients.join(", ") : "None required"}
                  </p>
                </div>
              </div>

              <ol className="space-y-3">
                {result.steps.map((step, index) => (
                  <li key={`${step.title}-${index}`} className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[color:var(--swedish-blue)] text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-black">
                          {step.title} | {step.timeMinutes}m
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{step.detail}</p>
                        <p className="mt-2 text-sm font-semibold text-[color:var(--swedish-blue)]">{step.beginnerCue}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="border border-[color:var(--safety-green)] bg-[#edf6ef] p-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#174b30]">
                  <ShieldCheck className="h-4 w-4" />
                  Safety notes
                </p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-[#174b30]">
                  {result.safetyNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-black">Substitutions</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-[color:var(--muted)]">
                    {result.substitutions.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Rescue tips</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-[color:var(--muted)]">
                    {result.rescueTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ) : (
            <div className="mt-5 border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] p-5">
              <p className="text-sm font-semibold text-black">Ready when your ingredient list is confirmed.</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                The result will include used ingredients, optional staples, steps, safety notes, substitutions,
                rescue tips, and storage tips.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
