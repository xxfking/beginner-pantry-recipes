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
    <main className="site-shell">
      <JsonLd data={buildHomeJsonLd()} />
      <header className="site-header">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Beginner Pantry Recipes home">
            <span className="brand-mark">B</span>
            <span>
              <span className="block font-display text-lg font-semibold leading-5">{siteConfig.name}</span>
              <span className="block text-[11px] font-medium text-[color:var(--muted)]">{siteConfig.tagline}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-black md:flex" aria-label="Main navigation">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-transparent py-2 transition hover:border-black">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden justify-end text-[13px] font-semibold text-black md:flex">EN</div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-end">
          <div>
            <h1 className="display-heading max-w-[760px] text-[clamp(3rem,4.4vw,4.8rem)] text-black">
              Recipe Generator From Ingredients You Have
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-7 text-[color:var(--muted)]">
              Upload a pantry photo, edit the ingredient list, choose your kitchen constraints, and generate a recipe built for beginner cooks.
            </p>
          </div>
          <div className="hidden h-px bg-[color:var(--border)] lg:block" />
        </div>
      </section>

      <RecipeTool seedIngredients={["leftover rice", "eggs", "frozen peas", "soy sauce"]} />

      <section className="mx-auto w-full max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="section-rule pt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-medium text-black">Popular ingredient searches</h2>
            <Link href="/easy-pantry-meals-for-beginners" className="hidden text-sm font-semibold text-[color:var(--swedish-blue)] sm:inline">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seoPages.slice(0, 8).map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="min-h-20 border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4 text-sm font-semibold leading-6 text-black transition hover:border-[color:var(--swedish-blue)] hover:text-[color:var(--swedish-blue)]"
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
