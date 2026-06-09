import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { RecipeTool } from "@/components/RecipeTool";
import { seoPages } from "@/lib/seo-pages";
import { buildHomeJsonLd } from "@/lib/structured-data";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Beginner Recipe Generator From Ingredients You Have",
  description:
    "Upload pantry or fridge ingredients, confirm what you have, and generate a beginner-safe recipe with clear steps and safety notes.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Beginner Recipe Generator From Ingredients You Have",
    description:
      "Generate beginner-safe recipes from pantry photos and typed ingredients.",
    url: absoluteUrl("/"),
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-stone-950">
      <JsonLd data={buildHomeJsonLd()} />
      <header className="border-b border-stone-200 bg-white/95">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Beginner Pantry Recipes home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 text-lg font-bold text-white">
              B
            </span>
            <span>
              <span className="block text-base font-semibold leading-5">{siteConfig.name}</span>
              <span className="block text-xs font-medium text-stone-500">{siteConfig.tagline}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-stone-600 md:flex" aria-label="Main navigation">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-emerald-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Recipe Generator From Ingredients You Have
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
            Upload a pantry photo, edit the ingredient list, choose your kitchen constraints, and generate a recipe built for beginner cooks.
          </p>
        </div>
      </section>

      <RecipeTool seedIngredients={["leftover rice", "eggs", "frozen peas", "soy sauce"]} />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="border-t border-stone-200 pt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Popular ingredient searches</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {seoPages.slice(0, 8).map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="rounded-lg border border-stone-200 bg-white p-4 text-sm font-semibold leading-6 text-stone-800 transition hover:border-emerald-500 hover:text-emerald-800"
              >
                {page.h1}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
