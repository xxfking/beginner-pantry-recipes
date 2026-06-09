import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { RecipeTool } from "@/components/RecipeTool";
import {
  getSeoPageByPath,
  getSeoPageStaticParams,
  seoPages,
  slugToPath,
} from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { buildSeoPageJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getSeoPageStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageByPath(slugToPath(slug));

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: absoluteUrl(page.path),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: absoluteUrl(page.path),
      type: "article",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPageByPath(slugToPath(slug));

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] text-stone-950">
      <JsonLd data={buildSeoPageJsonLd(page)} />
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

      <article>
        <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">{page.intro}</p>
          </div>
        </section>

        <RecipeTool seedIngredients={page.seedIngredients} pageIntent={page.intent} />

        <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 border-t border-stone-200 pt-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                Beginner method for {page.keyword}
              </h2>
              <p className="mt-4 text-base leading-8 text-stone-700">{page.promise}</p>
              <div className="mt-6 space-y-4">
                {page.beginnerTips.map((tip, index) => (
                  <div key={tip} className="rounded-lg border border-stone-200 bg-white p-4">
                    <p className="text-sm font-semibold text-emerald-700">Step {index + 1}</p>
                    <p className="mt-1 text-base leading-7 text-stone-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Recipe ideas</h2>
                <ul className="mt-4 space-y-3 text-base leading-7 text-stone-700">
                  {page.recipeIdeas.map((idea) => (
                    <li key={idea} className="rounded-lg border border-stone-200 bg-white p-3">
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Safety notes</h2>
                <ul className="mt-4 space-y-3 text-base leading-7 text-stone-700">
                  {page.safetyFocus.map((note) => (
                    <li key={note} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-950">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <section className="mt-10 border-t border-stone-200 pt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">FAQ</h2>
            <div className="mt-5 grid gap-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-stone-200 bg-white p-4">
                  <h3 className="text-base font-semibold text-stone-950">{faq.question}</h3>
                  <p className="mt-2 text-base leading-7 text-stone-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 border-t border-stone-200 pt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">More pantry searches</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {seoPages
                .filter((related) => related.path !== page.path)
                .slice(0, 6)
                .map((related) => (
                  <Link
                    key={related.path}
                    href={related.path}
                    className="rounded-lg border border-stone-200 bg-white p-4 text-sm font-semibold leading-6 text-stone-800 transition hover:border-emerald-500 hover:text-emerald-800"
                  >
                    {related.h1}
                  </Link>
                ))}
            </div>
          </section>
        </section>
      </article>
    </main>
  );
}
